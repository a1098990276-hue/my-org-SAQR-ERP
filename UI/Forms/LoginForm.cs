using System;
using System.Windows.Forms;

namespace YourNamespace
{
    public class LoginForm : Form
    {
        public LoginForm()
        {
            InitializeComponent();
        }

        private void InitializeComponent()
        {
            this.Text = "تسجيل الدخول";
            this.RightToLeft = RightToLeft.Yes;
            this.StartPosition = FormStartPosition.CenterScreen;

            Label usernameLabel = new Label() { Text = "اسم المستخدم:" }; 
            TextBox usernameTextBox = new TextBox();

            Label passwordLabel = new Label() { Text = "كلمة المرور:" }; 
            TextBox passwordTextBox = new TextBox() { PasswordChar = '*'};

            Button loginButton = new Button() { Text = "تسجيل الدخول" };
            loginButton.Click += (sender, e) => { 
                // Handle login logic here
            };

            FlowLayoutPanel panel = new FlowLayoutPanel();
            panel.FlowDirection = FlowDirection.RightToLeft;
            panel.Controls.Add(usernameLabel);
            panel.Controls.Add(usernameTextBox);
            panel.Controls.Add(passwordLabel);
            panel.Controls.Add(passwordTextBox);
            panel.Controls.Add(loginButton);
            this.Controls.Add(panel);
        }
    }
}