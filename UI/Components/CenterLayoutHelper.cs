using System;
using System.Windows.Forms; // Include necessary namespaces

namespace UI.Components
{
    public static class CenterLayoutHelper
    {
        // Method to center a Control horizontally
        public static void CenterHorizontally(Control control)
        {
            if (control.Parent == null)
                throw new InvalidOperationException("Control must have a parent.");
            control.Left = (control.Parent.ClientSize.Width - control.Width) / 2;
        }

        // Method to wire centering behavior with responsive resizing
        public static void WireCentering(Control control)
        {
            if (control.Parent == null)
                throw new InvalidOperationException("Control must have a parent.");

            // Center the control initially
            CenterHorizontally(control);

            // Add a resize event handler to the parent
            control.Parent.Resize += (s, e) => CenterHorizontally(control);
        }
    }
}