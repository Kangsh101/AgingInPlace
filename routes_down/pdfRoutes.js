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

        // 운동량과 수면 데이터 
        const activityUrl = `http://3.39.236.95:8080/downloadCsv/activityUsername`;
        const sleepUrl = `http://3.39.236.95:8080/downloadCsv/sleepUsername`;

        Promise.all([
          axios.post(activityUrl, { username: patient.name }),
          axios.post(sleepUrl, { username: patient.name })
        ])
        .then(([activityResponse, sleepResponse]) => {
          const activityData = activityResponse.data;
          const sleepData = sleepResponse.data;

          res.setHeader('Content-Disposition', 'attachment; filename=patientInfo.pdf');
          res.setHeader('Content-Type', 'application/pdf');

          const doc = new PDFDocument({
            size: 'A4',
            margins: { top: 50, left: 50, right: 50, bottom: 50 },
          });
          doc.pipe(res);

          //한글 폰트 등록
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

          // (4) 운동 / 수면량
          doc.fontSize(14).text('운동 / 수면량');
          doc.moveDown(0.7);
          doc.text('-------------------------------------------------------------------------');
          doc.moveDown(1);

          // 운동량 데이터
          doc.fontSize(12).text('운동 데이터:');
          doc.moveDown(0.5);
          if (Array.isArray(activityData) && activityData.length > 0) {
            activityData.forEach((item, idx) => {
              doc.text(`▶ [${idx + 1}] ID: ${item.id || '-'}`);
              doc.text(`   이름: ${item.name || '-'}`);
              doc.text(`   날짜: ${item.birthDate || '-'}`);
              doc.text(`   활동 칼로리: ${item.calActive || '-'}`);
              doc.text(`   총 칼로리: ${item.calTotal || '-'}`);
              doc.text(`   일일 움직임: ${item.dailyMovement || '-'}`);
              doc.moveDown(1);
            });
          } else if (typeof activityData === 'string') {
            // CSV 형태 그대로 표시
            doc.text(activityData);
          } else {
            doc.text('운동량 데이터가 없습니다.');
          }

          doc.moveDown(1);

          // 수면 데이터
          doc.fontSize(12).text('수면 데이터:');
          doc.moveDown(0.5);
          if (Array.isArray(sleepData) && sleepData.length > 0) {
            sleepData.forEach((item, idx) => {
              doc.text(`▶ [${idx + 1}] ID: ${item.id || '-'}`);
              doc.text(`   이름: ${item.name || '-'}`);
              doc.text(`   취침 시간: ${item.bedTimeStart || '-'}`);
              doc.text(`   기상 시간: ${item.bedTimeEnd || '-'}`);
              doc.text(`   호흡 평균: ${item.breathAverage || '-'}`);
              doc.moveDown(1);
            });
          } else if (typeof sleepData === 'string') {
            doc.text(sleepData);
          } else {
            doc.text('수면 데이터가 없습니다.');
          }

          doc.end();
        })
        .catch(err => {
          console.error('운동량 또는 수면 데이터 fetch 중 오류 발생: ', err);
          // PDF가 이미 생성 중이므로 에러 메시지를 PDF에 기록한 후 종료
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
