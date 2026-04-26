const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/booking', (req, res) => {
  const {
    name,
    phone,
    checkIn,
    checkOut,
    guests,
    message,
  } = req.body || {};

  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('กรุณากรอกชื่อให้ถูกต้อง');
  }

  const phonePattern = /^[0-9+\-\s]{8,15}$/;
  if (!phone || typeof phone !== 'string' || !phonePattern.test(phone.trim())) {
    errors.push('กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง');
  }

  if (!checkIn) {
    errors.push('กรุณาเลือกวันที่เช็กอิน');
  }

  if (!checkOut) {
    errors.push('กรุณาเลือกวันที่เช็กเอาต์');
  }

  const guestCount = Number(guests);
  if (!guestCount || guestCount < 1 || guestCount > 20) {
    errors.push('จำนวนผู้เข้าพักต้องอยู่ระหว่าง 1 - 20 คน');
  }

  if (checkIn && checkOut) {
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);

    if (Number.isNaN(inDate.getTime()) || Number.isNaN(outDate.getTime())) {
      errors.push('รูปแบบวันที่ไม่ถูกต้อง');
    } else if (outDate <= inDate) {
      errors.push('วันที่เช็กเอาต์ต้องหลังจากวันที่เช็กอิน');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'ไม่สามารถส่งคำขอจองได้',
      errors,
    });
  }

  const booking = {
    name: name.trim(),
    phone: phone.trim(),
    checkIn,
    checkOut,
    guests: guestCount,
    message: typeof message === 'string' ? message.trim() : '',
    createdAt: new Date().toISOString(),
  };

  console.log('มีคำขอจองใหม่:', booking);

  return res.status(200).json({
    success: true,
    message: 'ส่งคำขอจองเรียบร้อยแล้ว ทางที่พักจะติดต่อกลับโดยเร็วที่สุด',
  });
});

app.listen(PORT, () => {
  console.log(`เซิร์ฟเวอร์ทำงานที่พอร์ต ${PORT}`);
});
