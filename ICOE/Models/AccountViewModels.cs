using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ICOE.Models
{
    public class ExternalLoginConfirmationViewModel
    {
        [Required]
        [Display(Name = "Email")]
        public string Email { get; set; }
    }

    public class ExternalLoginListViewModel
    {
        public string ReturnUrl { get; set; }
    }

    public class SendCodeViewModel
    {
        public string SelectedProvider { get; set; }
        public ICollection<System.Web.Mvc.SelectListItem> Providers { get; set; }
        public string ReturnUrl { get; set; }
        public bool RememberMe { get; set; }
    }

    public class VerifyCodeViewModel
    {
        [Required]
        public string Provider { get; set; }

        [Required]
        [Display(Name = "Code")]
        public string Code { get; set; }
        public string ReturnUrl { get; set; }

        [Display(Name = "Remember this browser?")]
        public bool RememberBrowser { get; set; }

        public bool RememberMe { get; set; }
    }

    public class ForgotViewModel
    {
        [Required]
        [Display(Name = "Email")]
        public string Email { get; set; }
    }

    public class LoginViewModel
    {
        [Required]
        [Display(Name = "Email")]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Profil harus dipilih !")]
        [Display(Name = "Profile")]
        public string Profile { get; set; }

        [Display(Name = "Remember me?")]
        public bool RememberMe { get; set; }

        [Required]
        [Display(Name = "User Name")]
        public string UserName { get; set; }

        [Display(Name = "FullName")]
        public string FullName { get; set; }

        public string NRP { get; set; }
        public string EMPLOYEEID { get; set; }
        public string NAME { get; set; }
        public string GPID { get; set; }
        public int GPID_CODE { get; set; }
        public string GPID_DESC { get; set; }
        public string WEB_API_SERVICE_PATH { get; set; }
        public string WEB_APP_PATH { get; set; }
        public string REPORT_SERVER_PATH { get; set; }
        public string REPORT_URL_PATH { get; set; }
        public string POST_ID { get; set; }
        public string POST_DESC { get; set; }
        public string DEPT_CODE { get; set; }
        public string DEPT_DESC { get; set; }
        public string DIV_CODE { get; set; }
        public string DIV_DESC { get; set; }
        public string DIV_CODE_FUNC { get; set; }
        public string DIV_DESC_FUNC { get; set; }
        public string DISTRICT_CODE { get; set; }
        public string HIRE_DATE { get; set; }
        public string HIRE_DATE_YY { get; set; }
        public string HIRE_DATE_MM { get; set; }
        public string HIRE_DATE_DD { get; set; }
        public string PHOTO_URL { get; set; }
        public string APPROVER_IDENTITY { get; set; }
        public string CREATE_ACCESS { get; set; }
        public string READ_ACCESS { get; set; }
        public string UPDATE_ACCESS { get; set; }
        public string DELETE_ACCESS { get; set; }
        public bool? VALID_ACCESS { get; set; }

       public List<cusp_GetProfileMenuResult> MENU { get; set; }
    }

    public class RegisterViewModel
    {
        [Required]
        [EmailAddress]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
    }

    public class ResetPasswordViewModel
    {
        [Required]
        [EmailAddress]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }

        public string Code { get; set; }
    }

    public class ForgotPasswordViewModel
    {
        [Required]
        [EmailAddress]
        [Display(Name = "Email")]
        public string Email { get; set; }
    }
}
