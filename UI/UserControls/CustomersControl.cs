using System.Windows.Forms;  
using System.Drawing;  
using System.ComponentModel;  
  
namespace MyOrg.SAQR.ERP.UI.UserControls  
{  
    public partial class CustomersControl : UserControl  
    {  
        private DataGridView customersDataGrid;  
        private Button addButton, editButton, deleteButton;  
        private TextBox searchTextBox;  
        
        public CustomersControl()  
        {  
            InitializeComponent();  
        }  
        
        private void InitializeComponent()  
        {  
            this.SuspendLayout();  
            //  
            // customersDataGrid  
            //  
            this.customersDataGrid = new DataGridView();  
            this.customersDataGrid.Columns.Add("Name", "Name");  
            this.customersDataGrid.Columns.Add("Phone", "Phone");  
            this.customersDataGrid.Columns.Add("Address", "Address");  
            this.customersDataGrid.Columns.Add("Balance", "Balance");  
            this.customersDataGrid.Dock = DockStyle.Fill;  
            this.customersDataGrid.AutoSizeColumnsMode = DataGridViewAutoSizeColumnsMode.Fill;  
            
            //  
            // searchTextBox  
            //  
            this.searchTextBox = new TextBox();  
            this.searchTextBox.Anchor = AnchorStyles.Top;  
            this.searchTextBox.Width = 960;  
            //  
            // Add Button  
            //  
            this.addButton = new Button();  
            this.addButton.Text = "إضافة"; // "Add" in Arabic  
            this.addButton.Anchor = AnchorStyles.Top;  
            this.addButton.Width = 100;  
            this.addButton.Location = new Point(380, 40);  // Centered position  
            this.addButton.Click += new EventHandler(AddButton_Click);  
            //  
            // Edit Button  
            //  
            this.editButton = new Button();  
            this.editButton.Text = "تعديل"; // "Edit" in Arabic  
            this.editButton.Anchor = AnchorStyles.Top;  
            this.editButton.Width = 100;  
            this.editButton.Location = new Point(490, 40);  // Centered position  
            this.editButton.Click += new EventHandler(EditButton_Click);  
            //  
            // Delete Button  
            //  
            this.deleteButton = new Button();  
            this.deleteButton.Text = "حذف"; // "Delete" in Arabic  
            this.deleteButton.Anchor = AnchorStyles.Top;  
            this.deleteButton.Width = 100;  
            this.deleteButton.Location = new Point(600, 40);  // Centered position  
            this.deleteButton.Click += new EventHandler(DeleteButton_Click);  
            //  
            // CustomersControl  
            //  
            this.Controls.Add(this.customersDataGrid);  
            this.Controls.Add(this.searchTextBox);  
            this.Controls.Add(this.addButton);  
            this.Controls.Add(this.editButton);  
            this.Controls.Add(this.deleteButton);  
            this.Name = "CustomersControl";  
            this.RightToLeft = RightToLeft.Yes; // Enable RTL layout  
            this.Size = new Size(960, 600);  
            this.ResumeLayout(false);  
        }  
        
        private void AddButton_Click(object sender, EventArgs e)  
        {  
            // Add customer logic  
        }  
        
        private void EditButton_Click(object sender, EventArgs e)  
        {  
            // Edit customer logic  
        }  
        
        private void DeleteButton_Click(object sender, EventArgs e)  
        {  
            // Delete customer logic  
        }  
    }  
}  
