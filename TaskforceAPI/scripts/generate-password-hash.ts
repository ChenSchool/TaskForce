import bcrypt from 'bcrypt';

const password = 'admin123';

bcrypt.hash(password, 10).then(hash => {
  console.log('='.repeat(60));
  console.log('Admin password hash generated');
  console.log('='.repeat(60));
  console.log('\nPassword:', password);
  console.log('\nHash:', hash);
  console.log('\nUpdate the migration_auth.sql file with this hash');
  console.log('='.repeat(60));
}).catch(err => {
  console.error('Error generating hash:', err);
});
