using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WishHeroes.Frameworks.Extensions
{
    public static class StringExtensions
    {
        public static string ToFirstUpper(this string text)
        {
            if (String.IsNullOrEmpty(text)) return null;

            return (text.Substring(0, 1).ToUpper()) + (text.Substring(1, text.Length - 1).ToLower());
        }

        public static string ToTitleCase(this string text)
        {
            if (String.IsNullOrEmpty(text)) return null;

            return new CultureInfo("en-US", false).TextInfo.ToTitleCase(text);
        }
    }
}
