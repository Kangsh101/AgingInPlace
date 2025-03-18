// routes_down/pdfRoutes.js
const express = require('express');
const axios = require('axios');
const PDFDocument = require('pdfkit');
const path = require('path');
const router = express.Router();
const connection = require('../src/db'); // DB 연결 모듈

router.get('/download-pdf/:id', (req, res) => {
  const patientId = req.params.id;

  // 1) 환자 기본 정보 조회
  const queryPatient = `
    SELECT
      id,
      name,
      DATE_FORMAT(birthdate, "%Y-%m-%d") AS birthdate,
      gender,
      phoneNumber
    FROM members
    WHERE id = ? AND role = '환자'
  `;
  connection.query(queryPatient, [patientId], (err, patientResults) => {
    if (err) {
      console.error(err);
      return res.status(500).send('DB 조회 중 오류 발생(환자 정보)');
    }
    if (patientResults.length === 0) {
      return res.status(404).send('환자 정보를 찾을 수 없습니다.');
    }
    const patient = patientResults[0];

    // 2) 진단 목록 조회
    const queryDiagnoses = `
      SELECT diagnosis
      FROM diagnoses
      WHERE patient_id = ?
    `;
    connection.query(queryDiagnoses, [patientId], (err, diagResults) => {
      if (err) {
        console.error(err);
        return res.status(500).send('DB 조회 중 오류 발생(진단 정보)');
      }
      const allDiagnoses = diagResults
        .map(row => row.diagnosis)
        .filter(d => d && d !== '');
      const uniqueDiagnoses = [...new Set(allDiagnoses)];
      const diagnosisText = uniqueDiagnoses.length > 0
        ? uniqueDiagnoses.join(', ')
        : '없음';

      // 3) 약물 목록 조회
      const queryMeds = `
        SELECT medication, dosage, frequency, alarm_time
        FROM medications
        WHERE patient_id = ?
      `;
      connection.query(queryMeds, [patientId], (err, medsResults) => {
        if (err) {
          console.error(err);
          return res.status(500).send('DB 조회 중 오류 발생(약물 정보)');
        }
        const medicationsData = medsResults.map(m => ({
          medication: m.medication || '없음',
          dosage: m.dosage || '-',
          frequency: m.frequency || '-',
          alarm_time: m.alarm_time || '[]',
        }));

        const activityUrl = `http://3.39.236.95:8080/downloadCsv/activityUsername`;
        const sleepUrl = `http://3.39.236.95:8080/downloadCsv/sleepUsername`;

        Promise.all([
          axios.post(
            activityUrl,
            new URLSearchParams({ name: patient.name }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
          ),
          axios.post(
            sleepUrl,
            new URLSearchParams({ name: patient.name }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
          )
        ])
        .then(([activityResponse, sleepResponse]) => {
          // 데이터 없을 때 예외처리
          let activityData = activityResponse.data;
          let sleepData = sleepResponse.data;

          if (
            !activityData ||
            (Array.isArray(activityData) && activityData.length === 0) ||
            (typeof activityData === 'string' && activityData.trim() === '')
          ) {
            activityData = "측정된 데이터가 없습니다.";
          }

          if (
            !sleepData ||
            (Array.isArray(sleepData) && sleepData.length === 0) ||
            (typeof sleepData === 'string' && sleepData.trim() === '')
          ) {
            sleepData = "측정된 데이터가 없습니다.";
          }

          res.setHeader('Content-Disposition', 'attachment; filename=patientInfo.pdf');
          res.setHeader('Content-Type', 'application/pdf');

          const doc = new PDFDocument({
            size: 'A4',
            margins: { top: 50, left: 50, right: 50, bottom: 50 },
          });
          doc.pipe(res);

          doc.registerFont(
            'NanumGothicEco',
            path.join(__dirname, '../fonts/NanumGothicEco.otf')
          );
          doc.font('NanumGothicEco');

          doc.fontSize(20).text('Aging In Place', { align: 'center' });
          doc.moveDown(0.5);
          doc.moveDown(1);
          doc.fontSize(14).text('환자 정보');
          doc.moveDown(0.7);
          doc.fontSize(12).text(`이름 : ${patient.name}`);
          doc.text(`생년월일 : ${patient.birthdate}`);
          doc.text(`성별 : ${patient.gender}`);
          doc.text(`전화번호 : ${patient.phoneNumber}`);
          doc.moveDown(1);
          doc.text('-------------------------------------------------------------------------');
          doc.moveDown(1);

          // 진단 및 약물 정보
          doc.fontSize(14).text('진단명 / 약물 정보');
          doc.moveDown(0.7);
          doc.fontSize(12).text(`진단명 : ${diagnosisText}`);
          doc.moveDown(1);
          doc.fontSize(12).text('약물 정보:');
          doc.moveDown(0.3);
          if (
            medicationsData.length === 0 ||
            (medicationsData.length === 1 && medicationsData[0].medication === '없음')
          ) {
            doc.text('복용중인 약물이 없습니다.');
          } else {
            medicationsData.forEach((item, index) => {
              let alarmTimeArray = [];
              try {
                alarmTimeArray = JSON.parse(item.alarm_time);
              } catch (e) {
                alarmTimeArray = [];
              }
              const alarmTimeString = alarmTimeArray.length > 0
                ? alarmTimeArray.join(', ')
                : '없음';

              doc.text(`${index + 1}. 약물이름 : ${item.medication} (용량: ${item.dosage}, 복용 횟수: ${item.frequency})`);
              doc.text(`   - 알람시간 : ${alarmTimeString}`);
              doc.moveDown(0.7);
            });
          }
          doc.moveDown(1);
          doc.text('-------------------------------------------------------------------------');
          doc.moveDown(1);

          doc.fontSize(14).text('운동 / 수면량');
          doc.moveDown(0.7);
          doc.text('-------------------------------------------------------------------------');
          doc.moveDown(1);

          doc.fontSize(12).text('운동 데이터:');
          doc.moveDown(0.5);
          doc.text(activityData); 
          doc.moveDown(1);

          doc.fontSize(12).text('수면 데이터:');
          doc.moveDown(0.5);
          doc.text(sleepData); 

          doc.end();
        })
        .catch(err => {
          console.error('운동량 또는 수면 데이터 fetch 중 오류 발생: ', err);
          // 에러가 발생해도 PDF를 생성하여 에러 메시지 출력
          res.setHeader('Content-Disposition', 'attachment; filename=patientInfo.pdf');
          res.setHeader('Content-Type', 'application/pdf');

          const doc = new PDFDocument({
            size: 'A4',
            margins: { top: 50, left: 50, right: 50, bottom: 50 },
          });
          doc.pipe(res);

          doc.registerFont(
            'NanumGothicEco',
            path.join(__dirname, '../fonts/NanumGothicEco.otf')
          );
          doc.font('NanumGothicEco');

          doc.fontSize(18).text('오류 발생', { align: 'center' });
          doc.moveDown(1);
          doc.fontSize(14).text('운동량 또는 수면 데이터를 가져오는 중 오류가 발생했습니다.');
          doc.moveDown(1);
          doc.fontSize(10).text(err.message);

          doc.end();
        });
      });
    });
  });
});

module.exports = router;
