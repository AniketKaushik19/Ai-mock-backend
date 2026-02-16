-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  subscription_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  features TEXT NOT NULL COMMENT 'JSON string of features array',
  price DECIMAL(10, 2) NOT NULL,
  Monthly_limit INT DEFAULT NULL COMMENT 'Number of interviews allowed per month',
  isActive TINYINT(1) DEFAULT 1 COMMENT '1 = active, 0 = inactive',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_isActive (isActive)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  subscription_id INT NOT NULL,
  razorpay_order_id VARCHAR(255) NOT NULL,
  razorpay_payment_id VARCHAR(255) DEFAULT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'active', 'expired', 'cancelled') DEFAULT 'pending',
  start_date DATETIME DEFAULT NULL,
  end_date DATETIME DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_subscription_id (subscription_id),
  INDEX idx_status (status),
  INDEX idx_razorpay_order_id (razorpay_order_id),
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(subscription_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default subscription plans
INSERT INTO subscriptions (name, features, price, Monthly_limit, isActive) VALUES
('Free', '["1 Mock Interview", "Basic Feedback", "Email Support"]', 0.00, 1, 1),
('Basic', '["5 Mock Interviews", "AI-Powered Feedback", "Performance Analytics", "Email Support"]', 999.00, 5, 1),
('Premium', '["Unlimited Mock Interviews", "Advanced AI Feedback", "Resume Review", "Priority Support", "Interview Recording"]', 2499.00, NULL, 1);
