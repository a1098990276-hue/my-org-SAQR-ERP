using System;
using System.Windows.Forms;
using System.Drawing;

public class MainForm : Form
{
    private const int SidebarMaxWidth = 200;
    private const int AnimationStep = 10;
    private const int AnimationInterval = 15;

    private Panel sidebar;
    private Panel topbar;
    private Button menuButton;
    private Timer menuTimer;
    private bool isMenuOpen = false;

    public MainForm()
    {
        InitializeComponents();
    }

    private void InitializeComponents()
    {
        this.sidebar = new Panel() { Width = 0, Dock = DockStyle.Left, BackColor = Color.Gray };
        this.topbar = new Panel() { Height = 50, Dock = DockStyle.Top, BackColor = Color.DarkGray };

        this.menuButton = new Button() { Text = "☰", Width = 40, Height = 40 };
        this.menuButton.Click += MenuButton_Click;
        this.topbar.Controls.Add(menuButton);

        this.menuTimer = new Timer() { Interval = 10 };
        this.menuTimer.Tick += MenuTimer_Tick;

        // Add elements to sidebar
        // Add elements to topbar

        this.Controls.Add(sidebar);
        this.Controls.Add(topbar);
        this.Text = "SAQR ERP Main Form";
        this.Size = new Size(800, 600);
    }

    private void MenuButton_Click(object sender, EventArgs e)
    {
        menuTimer.Start();
    }

    private void MenuTimer_Tick(object sender, EventArgs e)
    {
        if (!isMenuOpen)
        {
            // Open the menu
            sidebar.Width += 10;
            if (sidebar.Width >= 200)
            {
                menuTimer.Stop();
                isMenuOpen = true;
            }
        }
        else
        {
            // Close the menu
            sidebar.Width -= 10;
            if (sidebar.Width <= 0)
            {
                menuTimer.Stop();
                isMenuOpen = false;
            }
        }
    }
}