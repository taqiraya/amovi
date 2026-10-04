import pool from '../config/db.js';

/**
 * ثبت پیام جدید ارسالی از فرم تماس با ما در پایگاه داده MySQL
 * POST /api/contact
 */
export async function createContactMessage(req, res) {
  try {
    const { 
      fullName, 
      full_name,
      email, 
      phoneWhatsApp, 
      phone_whatsapp,
      subject, 
      message 
    } = req.body;

    const resolvedFullName = (fullName || full_name || '').trim();
    const resolvedEmail = (email || '').trim();
    const resolvedPhone = (phoneWhatsApp || phone_whatsapp || '').trim();
    const resolvedSubject = (subject || '').trim();
    const resolvedMessage = (message || '').trim();

    // اعتبارسنجی فیلدهای ضروری
    if (!resolvedFullName) {
      return res.status(400).json({ 
        success: false, 
        error: 'نام و تخلص الزامی است.' 
      });
    }

    if (!resolvedEmail) {
      return res.status(400).json({ 
        success: false, 
        error: 'آدرس ایمیل الزامی است.' 
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resolvedEmail)) {
      return res.status(400).json({ 
        success: false, 
        error: 'فرمت آدرس ایمیل نامعتبر است.' 
      });
    }

    if (!resolvedMessage) {
      return res.status(400).json({ 
        success: false, 
        error: 'متن پیام الزامی است.' 
      });
    }

    const insertQuery = `
      INSERT INTO contact_messages (full_name, email, phone_whatsapp, subject, message, status)
      VALUES (?, ?, ?, ?, ?, 'unread')
    `;

    const [result] = await pool.query(insertQuery, [
      resolvedFullName,
      resolvedEmail,
      resolvedPhone || null,
      resolvedSubject || null,
      resolvedMessage
    ]);

    const createdRecord = {
      id: result.insertId,
      fullName: resolvedFullName,
      full_name: resolvedFullName,
      email: resolvedEmail,
      phoneWhatsApp: resolvedPhone,
      phone_whatsapp: resolvedPhone,
      subject: resolvedSubject,
      message: resolvedMessage,
      status: 'unread',
      created_at: new Date().toISOString(),
      submittedAt: new Date().toISOString()
    };

    console.log(`[Contact Form] New message #${result.insertId} received from: ${resolvedFullName} <${resolvedEmail}>`);

    return res.status(201).json({
      success: true,
      message: 'پیام شما با موفقیت در دیتابیس ثبت شد و کارشناسان ما به زودی با شما تماس خواهند گرفت.',
      data: createdRecord
    });
  } catch (error) {
    console.error('[Contact Controller Error] Failed to create message:', error);
    return res.status(500).json({
      success: false,
      error: 'خطا در ثبت پیام در سرور. لطفاً دوباره تلاش فرمایید.'
    });
  }
}

/**
 * دریافت تمامی پیام‌های تماس از دیتابیس (برای پنل مدیریت و دریافت پیام‌ها)
 * GET /api/contact
 */
export async function getContactMessages(req, res) {
  try {
    const { status, limit = 100 } = req.query;
    
    let query = 'SELECT * FROM contact_messages';
    const params = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ?';
    params.push(Number(limit));

    const [rows] = await pool.query(query, params);

    // نگاشت رکوردها برای سازگاری کامل با هر دو ساختار camelCase و snake_case
    const formattedRows = rows.map((row) => ({
      id: row.id,
      fullName: row.full_name,
      full_name: row.full_name,
      email: row.email,
      phoneWhatsApp: row.phone_whatsapp,
      phone_whatsapp: row.phone_whatsapp,
      subject: row.subject,
      message: row.message,
      status: row.status,
      created_at: row.created_at,
      submittedAt: row.created_at
    }));

    return res.status(200).json(formattedRows);
  } catch (error) {
    console.error('[Contact Controller Error] Failed to fetch messages:', error);
    return res.status(500).json({
      success: false,
      error: 'خطا در دریافت پیام‌ها از دیتابیس.'
    });
  }
}

/**
 * به‌روزرسانی وضعیت پیام (خوانده‌شده / بایگانی)
 * PATCH /api/contact/:id/status
 */
export async function updateContactStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['unread', 'read', 'archived'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'وضعیت نامعتبر است.'
      });
    }

    const [result] = await pool.query(
      'UPDATE contact_messages SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'پیام موردنظر یافت نشد.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'وضعیت پیام به‌روزرسانی شد.',
      status
    });
  } catch (error) {
    console.error('[Contact Controller Error] Failed to update status:', error);
    return res.status(500).json({
      success: false,
      error: 'خطا در به‌روزرسانی وضعیت پیام.'
    });
  }
}

/**
 * حذف پیام تماس
 * DELETE /api/contact/:id
 */
export async function deleteContactMessage(req, res) {
  try {
    const { id } = req.params;

    const [result] = await pool.query('DELETE FROM contact_messages WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'پیام موردنظر یافت نشد.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'پیام با موفقیت حذف شد.'
    });
  } catch (error) {
    console.error('[Contact Controller Error] Failed to delete message:', error);
    return res.status(500).json({
      success: false,
      error: 'خطا در حذف پیام.'
    });
  }
}
