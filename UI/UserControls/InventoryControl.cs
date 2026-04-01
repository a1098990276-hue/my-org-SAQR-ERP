using System.Windows.Controls;

namespace YourNamespace
{
    public partial class InventoryControl : UserControl
    {
        public InventoryControl()
        {
            InitializeComponent();
            this.Width = 960;
            this.HorizontalAlignment = System.Windows.HorizontalAlignment.Center;
            this.VerticalAlignment = System.Windows.VerticalAlignment.Top;

            // Adding a product grid
            var productGrid = new Grid();
            this.Content = productGrid;

            // Setting up the grid's columns and rows
            productGrid.ColumnDefinitions.Add(new ColumnDefinition());
            productGrid.ColumnDefinitions.Add(new ColumnDefinition());
            productGrid.RowDefinitions.Add(new RowDefinition());
            productGrid.RowDefinitions.Add(new RowDefinition());
            // Further setup of product grid goes here
        }
    }
}
