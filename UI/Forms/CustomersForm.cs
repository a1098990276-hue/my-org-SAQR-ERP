using System;
using System.Windows.Forms;
using System.Drawing;

namespace UI.Forms
{
    public class CustomersForm : Form
    {
        private DataGridView customersGrid;

        public CustomersForm()
        {
            InitializeComponents();
        }

        private void InitializeComponents()
        {
            this.Text = "العملاء";
            this.RightToLeft = RightToLeft.Yes;
            this.RightToLeftLayout = true;
            this.Size = new Size(800, 600);
            this.StartPosition = FormStartPosition.CenterScreen;

            this.customersGrid = new DataGridView()
            {
                Dock = DockStyle.Fill,
                AutoSizeColumnsMode = DataGridViewAutoSizeColumnsMode.Fill,
                AllowUserToAddRows = false,
                ReadOnly = true,
                RightToLeft = RightToLeft.Yes
            };

            this.customersGrid.Columns.Add("Id", "الرقم");
            this.customersGrid.Columns.Add("Name", "الاسم");
            this.customersGrid.Columns.Add("Phone", "الجوال");
            this.customersGrid.Columns.Add("City", "المدينة");
            this.customersGrid.Columns.Add("Balance", "الرصيد");

            this.Controls.Add(customersGrid);
            this.Load += CustomersForm_Load;
        }

        private void CustomersForm_Load(object sender, EventArgs e)
        {
            customersGrid.Rows.Add("1", "أحمد", "0555555555", "جدة", "0");
            customersGrid.Rows.Add("2", "سعود", "0566666666", "مكة", "150");
        }
    }
}
