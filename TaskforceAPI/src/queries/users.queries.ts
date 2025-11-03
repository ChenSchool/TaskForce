export const usersQueries = {
  getAllUsers: `
    SELECT id, username, name, email, role, created_at, updated_at, last_login, is_active, dark_mode
    FROM users
    WHERE is_active = 1
    ORDER BY created_at DESC
  `,
  
  getUserById: `
    SELECT id, username, name, email, role, created_at, updated_at, last_login, is_active, dark_mode
    FROM users
    WHERE id = ? AND is_active = 1
  `,
  
  getUserByUsername: `
    SELECT id, username, password, name, email, role, created_at, updated_at, last_login, is_active, dark_mode
    FROM users
    WHERE username = ? AND is_active = 1
  `,
  
  getUserByEmail: `
    SELECT id, username, password, name, email, role, created_at, updated_at, last_login, is_active, dark_mode
    FROM users
    WHERE email = ? AND is_active = 1
  `,
  
  createUser: `
    INSERT INTO users (username, password, name, email, role)
    VALUES (?, ?, ?, ?, ?)
  `,
  
  updateUser: `
    UPDATE users
    SET name = ?, email = ?, role = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `,
  
  updateLastLogin: `
    UPDATE users
    SET last_login = CURRENT_TIMESTAMP
    WHERE id = ?
  `,
  
  updatePassword: `
    UPDATE users
    SET password = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `,
  
  updateDarkMode: `
    UPDATE users
    SET dark_mode = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `,
  
  deactivateUser: `
    UPDATE users
    SET is_active = 0, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `,
  
  deleteUser: `
    DELETE FROM users
    WHERE id = ?
  `,
  
  // Refresh token queries
  saveRefreshToken: `
    INSERT INTO refresh_tokens (user_id, token, expires_at)
    VALUES (?, ?, ?)
  `,
  
  getRefreshToken: `
    SELECT id, user_id, token, expires_at, created_at
    FROM refresh_tokens
    WHERE token = ? AND expires_at > NOW()
  `,
  
  deleteRefreshToken: `
    DELETE FROM refresh_tokens
    WHERE token = ?
  `,
  
  deleteUserRefreshTokens: `
    DELETE FROM refresh_tokens
    WHERE user_id = ?
  `
};
