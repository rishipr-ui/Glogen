<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set headers to allow cross-origin requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get the form type from the request
$formType = $_POST['form_type'] ?? '';

// Set recipient email (change this to your desired email)
$recipientEmail = 'info@glogencro.com'; // Using the email from the footer

// Initialize response array
$response = ['success' => false, 'message' => ''];

try {
    if ($formType === 'career') {
        // Handle career application form
        $name = $_POST['name'] ?? '';
        $email = $_POST['email'] ?? '';
        $phone = $_POST['phone'] ?? '';
        $position = $_POST['position'] ?? '';
        
        // Validate required fields
        if (empty($name) || empty($email) || empty($phone)) {
            throw new Exception('Please fill in all required fields.');
        }
        
        // Validate email format
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Please enter a valid email address.');
        }
        
        // Handle file upload
        $resumePath = '';
        if (isset($_FILES['resume']) && $_FILES['resume']['error'] === UPLOAD_ERR_OK) {
            $allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            $fileType = $_FILES['resume']['type'];
            
            if (!in_array($fileType, $allowedTypes)) {
                throw new Exception('Please upload a valid resume file (PDF, DOC, or DOCX).');
            }
            
            $uploadDir = 'uploads/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            
            $fileName = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $_FILES['resume']['name']);
            $resumePath = $uploadDir . $fileName;
            
            if (!move_uploaded_file($_FILES['resume']['tmp_name'], $resumePath)) {
                throw new Exception('Failed to upload resume file.');
            }
        }
        
        // Prepare email content
        $subject = "New Job Application - $position";
        $message = "
        <html>
        <head>
            <title>New Job Application</title>
        </head>
        <body>
            <h2>New Job Application Received</h2>
            <p><strong>Position:</strong> $position</p>
            <p><strong>Name:</strong> $name</p>
            <p><strong>Email:</strong> $email</p>
            <p><strong>Phone:</strong> $phone</p>
            <p><strong>Resume:</strong> " . ($resumePath ? 'Attached' : 'Not provided') . "</p>
            <br>
            <p>This application was submitted from the GloGen Clinical Research website.</p>
        </body>
        </html>
        ";
        
        // Email headers
        $headers = [
            'MIME-Version: 1.0',
            'Content-type: text/html; charset=UTF-8',
            'From: GloGen Website <noreply@glogencro.com>',
            'Reply-To: ' . $email,
            'X-Mailer: PHP/' . phpversion()
        ];
        
        // Send email
        $mailSent = mail($recipientEmail, $subject, $message, implode("\r\n", $headers));
        
        if (!$mailSent) {
            throw new Exception('Failed to send email. Please try again later.');
        }
        
        $response = [
            'success' => true,
            'message' => 'Thank you for your application! We will review it and get back to you soon.'
        ];
        
    } elseif ($formType === 'contact') {
        // Handle contact form
        $name = $_POST['name'] ?? '';
        $email = $_POST['email'] ?? '';
        $phone = $_POST['phone'] ?? '';
        $message = $_POST['message'] ?? '';
        
        // Validate required fields
        if (empty($name) || empty($email) || empty($phone)) {
            throw new Exception('Please fill in all required fields.');
        }
        
        // Validate email format
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Please enter a valid email address.');
        }
        
        // Prepare email content
        $subject = "New Contact Form Submission - GloGen Clinical Research";
        $emailMessage = "
        <html>
        <head>
            <title>New Contact Form Submission</title>
        </head>
        <body>
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> $name</p>
            <p><strong>Email:</strong> $email</p>
            <p><strong>Phone:</strong> $phone</p>
            <p><strong>Message:</strong></p>
            <p>" . nl2br(htmlspecialchars($message)) . "</p>
            <br>
            <p>This message was submitted from the GloGen Clinical Research website contact form.</p>
        </body>
        </html>
        ";
        
        // Email headers
        $headers = [
            'MIME-Version: 1.0',
            'Content-type: text/html; charset=UTF-8',
            'From: GloGen Website <noreply@glogencro.com>',
            'Reply-To: ' . $email,
            'X-Mailer: PHP/' . phpversion()
        ];
        
        // Send email
        $mailSent = mail($recipientEmail, $subject, $emailMessage, implode("\r\n", $headers));
        
        if (!$mailSent) {
            throw new Exception('Failed to send email. Please try again later.');
        }
        
        $response = [
            'success' => true,
            'message' => "Thank you, $name! Your message has been received. We will get back to you shortly."
        ];
        
    } else {
        throw new Exception('Invalid form type.');
    }
    
} catch (Exception $e) {
    $response = [
        'success' => false,
        'message' => $e->getMessage()
    ];
}

// Return JSON response
echo json_encode($response);
?> 