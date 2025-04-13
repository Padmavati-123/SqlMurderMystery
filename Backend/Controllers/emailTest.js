require('dotenv').config();
const { testEmailAccounts, sendWelcomeEmail, sendPasswordResetEmail } = require('../src/utils/emailService');

// Function to run basic SMTP connection tests
const runConnectionTests = async (testEmail) => {
  console.log('\n=== RUNNING EMAIL CONNECTION TESTS ===\n');
  try {
    const results = await testEmailAccounts(testEmail);
    console.log('\nTest Results:');
    console.table(results);
    
    const allSuccessful = results.every(r => r.success);
    if (allSuccessful) {
      console.log('\n✅ All email accounts are working correctly!');
      return true;
    } else {
      console.log('\n⚠️ Some email accounts failed. Check the errors above.');
      return false;
    }
  } catch (error) {
    console.error('Test failed with error:', error);
    return false;
  }
};

// Function to test welcome email
const testWelcomeEmail = async (testEmail) => {
  console.log('\n=== TESTING WELCOME EMAIL ===\n');
  try {
    const result = await sendWelcomeEmail('Test Detective', testEmail);
    if (result) {
      console.log('✅ Welcome email test successful!');
      return true;
    } else {
      console.log('❌ Welcome email test failed');
      return false;
    }
  } catch (error) {
    console.error('Welcome email test failed with error:', error);
    return false;
  }
};

// Function to test password reset email
const testResetEmail = async (testEmail) => {
  console.log('\n=== TESTING PASSWORD RESET EMAIL ===\n');
  try {
    const resetUrl = 'http://localhost:5173/reset-password/test-token-example';
    const result = await sendPasswordResetEmail('Test Detective', testEmail, resetUrl);
    if (result) {
      console.log('✅ Password reset email test successful!');
      return true;
    } else {
      console.log('❌ Password reset email test failed');
      return false;
    }
  } catch (error) {
    console.error('Password reset email test failed with error:', error);
    return false;
  }
};

// Function to report overall test results
const reportResults = (connectionTest, welcomeEmail, resetEmail) => {
  console.log(`\n========================================`);
  console.log(`📊 TEST RESULTS SUMMARY`);
  console.log(`========================================`);
  console.log(`SMTP Connection Tests: ${connectionTest ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Welcome Email Test:    ${welcomeEmail ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Reset Email Test:      ${resetEmail ? '✅ PASSED' : '❌ FAILED'}`);
  
  const allPassed = connectionTest && welcomeEmail && resetEmail;
  console.log(`\n${allPassed ? '🎉 ALL TESTS PASSED!' : '⚠️ SOME TESTS FAILED'}`);
  
  return allPassed;
};

// Main function to run all tests
const runAllTests = async () => {
  const testEmail = process.argv[2];

  if (!testEmail) {
    console.error('Please provide a test email address as an argument');
    console.error('Example: node emailTest.js yourtestemail@example.com');
    process.exit(1);
  }

  console.log(`\n========================================`);
  console.log(`🔍 SQL MURDER MYSTERY EMAIL TEST SUITE`);
  console.log(`========================================`);
  console.log(`Testing email delivery to ${testEmail}...`);
  
  // Run all tests
  const connectionTestPassed = await runConnectionTests(testEmail);
  const welcomeEmailPassed = await testWelcomeEmail(testEmail);
  const resetEmailPassed = await testResetEmail(testEmail);
  
  // Report results
  const allPassed = reportResults(connectionTestPassed, welcomeEmailPassed, resetEmailPassed);
  
  // Exit with appropriate code
  process.exit(allPassed ? 0 : 1);
};

// Execute the main function
runAllTests().catch(error => {
  console.error('Test suite failed with error:', error);
  process.exit(1);
});