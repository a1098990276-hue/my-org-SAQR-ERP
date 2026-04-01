using System;
using System.Data;
using System.Windows.Forms;

namespace UserControls
{
    public partial class InvoicesControl : UserControl
    {
        public InvoicesControl()
        {
            InitializeComponent();
            LoadInvoices();
        }

        private void LoadInvoices()
        {
            // TODO: Load invoices into DataGridView
        }

        private void SearchInvoices()
        {
            // TODO: Implement search by invoice number/customer
        }

        private void FilterByStatus()
        {
            // TODO: Implement status filter combobox
        }

        private void NewInvoice()
        {
            // TODO: Implement creating a new invoice
        }

        private void EditInvoice()
        {
            // TODO: Implement editing an existing invoice
        }

        private void ViewInvoice()
        {
            // TODO: Implement viewing an invoice
        }

        private void PrintInvoice()
        {
            // TODO: Implement printing an invoice
        }
    }
}