using System;  
using System.Windows.Forms;  
  
namespace MyOrg.UI.UserControls  
{  
    public partial class SuppliersControl : UserControl  
    {  
        public SuppliersControl()  
        {  
            InitializeComponent();  
        }  
 
        private void InitializeComponent()  
        {  
            this.SuspendLayout();  
            //  
            // Search TextBox  
            //  
            TextBox searchTextBox = new TextBox() { RightToLeft = RightToLeft.Yes,  Width = 200 };  
            this.Controls.Add(searchTextBox);  
 
            //  
            // DataGridView  
            //  
            DataGridView dgvSuppliers = new DataGridView() {  
                Columns =  {  
                    new DataGridViewTextBoxColumn() { HeaderText = "Name" },  
                    new DataGridViewTextBoxColumn() { HeaderText = "Phone" },  
                    new DataGridViewTextBoxColumn() { HeaderText = "Address" },  
                    new DataGridViewTextBoxColumn() { HeaderText = "Due Amount" }  
                },  
                Width = 960,  
                Height = 400,  
                RightToLeft = RightToLeft.Yes  
            };  
            this.Controls.Add(dgvSuppliers);  
 
            //  
            // CRUD Buttons  
            //  
            Button btnAdd = new Button() { Text = "Add", Width = 100, Height = 30 };  
            Button btnUpdate = new Button() { Text = "Update", Width = 100, Height = 30 };  
            Button btnDelete = new Button() { Text = "Delete", Width = 100, Height = 30 };  
            Button btnSearch = new Button() { Text = "Search", Width = 100, Height = 30 };  
 
            FlowLayoutPanel panel = new FlowLayoutPanel() {  
                FlowDirection = FlowDirection.LeftToRight,  
                Width = 960,  
                Height = 40,  
                Dock = DockStyle.Top  
            };  
            panel.Controls.Add(btnAdd);  
            panel.Controls.Add(btnUpdate);  
            panel.Controls.Add(btnDelete);  
            panel.Controls.Add(btnSearch);  
            this.Controls.Add(panel);  
 
            //  
            // UserControl Properties  
            //  
            this.Dock = DockStyle.Fill;  
            this.ResumeLayout(false);  
        }  
    }  
}  
