using System;
using System.Windows.Forms;
using System.Drawing;

namespace UI.Forms
{
    public class CustomersForm : Form
    {
        private DataGridView customersGrid;
        private TextBox customerIdBox;
        private TextBox customerNameBox;
        private TextBox customerPhoneBox;
        private TextBox customerCityBox;
        private TextBox customerBalanceBox;

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
                Dock = DockStyle.Top,
                Height = 350,
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
            this.customersGrid.CellClick += CustomersGrid_CellClick;

            // Detail panel
            TableLayoutPanel detailPanel = new TableLayoutPanel()
            {
                Dock = DockStyle.Fill,
                ColumnCount = 2,
                RowCount = 5,
                Padding = new Padding(10)
            };
            detailPanel.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 30));
            detailPanel.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 70));

            this.customerIdBox = new TextBox() { Dock = DockStyle.Fill };
            this.customerNameBox = new TextBox() { Dock = DockStyle.Fill };
            this.customerPhoneBox = new TextBox() { Dock = DockStyle.Fill };
            this.customerCityBox = new TextBox() { Dock = DockStyle.Fill };
            this.customerBalanceBox = new TextBox() { Dock = DockStyle.Fill };

            string[] labels = { "الرقم:", "الاسم:", "الجوال:", "المدينة:", "الرصيد:" };
            TextBox[] fields = { customerIdBox, customerNameBox, customerPhoneBox, customerCityBox, customerBalanceBox };

            for (int i = 0; i < labels.Length; i++)
            {
                detailPanel.Controls.Add(new Label() { Text = labels[i], Dock = DockStyle.Fill, TextAlign = ContentAlignment.MiddleRight }, 0, i);
                detailPanel.Controls.Add(fields[i], 1, i);
            }

            this.Controls.Add(detailPanel);
            this.Controls.Add(customersGrid);
            this.Load += CustomersForm_Load;
        }

        private void CustomersForm_Load(object sender, EventArgs e)
        {
            customersGrid.Rows.Add("1", "أحمد", "0555555555", "جدة", "0");
            customersGrid.Rows.Add("2", "سعود", "0566666666", "مكة", "150");
        }

        private void CustomersGrid_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            if (e.RowIndex >= 0)
            {
                customerIdBox.Text = customersGrid.Rows[e.RowIndex].Cells[0].Value.ToString();
                customerNameBox.Text = customersGrid.Rows[e.RowIndex].Cells[1].Value.ToString();
                customerPhoneBox.Text = customersGrid.Rows[e.RowIndex].Cells[2].Value.ToString();
                customerCityBox.Text = customersGrid.Rows[e.RowIndex].Cells[3].Value.ToString();
                customerBalanceBox.Text = customersGrid.Rows[e.RowIndex].Cells[4].Value.ToString();
            }
        }
    }
}
