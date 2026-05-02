/**
 * Login & Sign-up — client-side validation and UX
 * ---------------------------------------------------------------------------
 * Sections:
 *  1. Constants & regex (email + password rules)
 *  2. DOM helpers (errors, touched state, submit state)
 *  3. Validators (pure functions used by live + submit checks)
 *  4. Form wiring (events, preventDefault, success messages)
 *  5. Password visibility toggles & view switching
 */

/* =============================================================================
   1. CONSTANTS & REGEX
   ============================================================================= */

/**
 * Email: practical pattern — non-space local + @ + domain labels with dots.
 * Not a full RFC parser; suitable for UI validation before server checks.
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Minimum length per spec (“6–8” read as at least 6 characters). */
const PASSWORD_MIN_LENGTH = 6;

const PASSWORD_UPPERCASE_REGEX = /[A-Z]/;
const PASSWORD_DIGIT_REGEX = /[0-9]/;

/* =============================================================================
   2. DOM HELPERS
   ============================================================================= */

/**
 * Toggle inline error: message under field + red border on invalid input.
 * @param {HTMLInputElement} input
 * @param {HTMLElement} errorEl
 * @param {string|null} message — null clears error styling
 */
function setFieldError(input, errorEl, message) {
  if (message) {
    errorEl.textContent = message;
    input.classList.add("input-error");
    input.setAttribute("aria-invalid", "true");
  } else {
    errorEl.textContent = "";
    input.classList.remove("input-error");
    input.removeAttribute("aria-invalid");
  }
}

/** @param {HTMLElement} el */
function showEl(el) {
  el.hidden = false;
}

/** @param {HTMLElement} el */
function hideEl(el) {
  el.hidden = true;
  el.textContent = "";
}

/**
 * After programmatic reset, restore password inputs and toggle buttons
 * (reset() does not always revert a JS-changed `type`).
 * @param {HTMLFormElement} form
 */
function resetPasswordUi(form) {
  form.querySelectorAll(".password-input-wrapper input").forEach((input) => {
    input.type = "password";
  });
  form.querySelectorAll(".toggle-password").forEach((btn) => {
    btn.setAttribute("aria-pressed", "false");
    btn.setAttribute("aria-label", "Show password");
  });
}

/**
 * Track whether user left the field so we can avoid nagging on first paint.
 * @param {HTMLInputElement} input
 */
function markTouched(input) {
  input.dataset.touched = "true";
}

/** @param {HTMLInputElement} input */
function isTouched(input) {
  return input.dataset.touched === "true";
}

/* =============================================================================
   3. VALIDATORS
   ============================================================================= */

function validateEmail(value) {
  const v = value.trim();
  if (!v) return "Email is required.";
  if (!EMAIL_REGEX.test(v)) return "Enter a valid email address.";
  return null;
}

/**
 * Sign-up password: min length, one uppercase, one digit.
 * @param {string} value
 */
function validateSignupPassword(value) {
  if (!value) return "Password is required.";
  if (value.length < PASSWORD_MIN_LENGTH) {
    return `Use at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  if (!PASSWORD_UPPERCASE_REGEX.test(value)) {
    return "Include at least one uppercase letter.";
  }
  if (!PASSWORD_DIGIT_REGEX.test(value)) {
    return "Include at least one number.";
  }
  return null;
}

/** Login password: required only (server enforces policy). */
function validateLoginPassword(value) {
  if (!value) return "Password is required.";
  return null;
}

function validateName(value) {
  const v = value.trim();
  if (!v) return "Name is required.";
  if (v.length < 2) return "Enter at least 2 characters.";
  return null;
}

/**
 * Confirm must match primary password when both touched or confirm non-empty.
 */
function validateConfirmPassword(password, confirm) {
  if (!confirm) return "Please confirm your password.";
  if (password !== confirm) return "Passwords do not match.";
  return null;
}

/* ----- Aggregate “form ready?” checks for disabled submit ----- */

function loginFormIsValid(emailInput, passwordInput) {
  return (
    validateEmail(emailInput.value) === null &&
    validateLoginPassword(passwordInput.value) === null
  );
}

function signupFormIsValid(nameInput, emailInput, passwordInput, confirmInput) {
  const pwd = passwordInput.value;
  return (
    validateName(nameInput.value) === null &&
    validateEmail(emailInput.value) === null &&
    validateSignupPassword(pwd) === null &&
    validateConfirmPassword(pwd, confirmInput.value) === null
  );
}

/* =============================================================================
   4. LOGIN FORM
   ============================================================================= */

function initLoginForm() {
  const form = document.getElementById("login-form-element");
  const emailInput = document.getElementById("login-email");
  const passwordInput = document.getElementById("login-password");
  const emailError = document.getElementById("login-email-error");
  const passwordError = document.getElementById("login-password-error");
  const submitBtn = document.getElementById("login-submit");
  const successEl = document.getElementById("login-success");
  const submitErrorEl = document.getElementById("login-submit-error");

  function refreshErrors() {
    const showEmailErr =
      isTouched(emailInput) || emailInput.value.length > 0;
    const showPwdErr =
      isTouched(passwordInput) || passwordInput.value.length > 0;

    setFieldError(
      emailInput,
      emailError,
      showEmailErr ? validateEmail(emailInput.value) : null
    );
    setFieldError(
      passwordInput,
      passwordError,
      showPwdErr ? validateLoginPassword(passwordInput.value) : null
    );
  }

  function refreshSubmit() {
    submitBtn.disabled = !loginFormIsValid(emailInput, passwordInput);
  }

  function onFieldChange() {
    refreshErrors();
    refreshSubmit();
    hideEl(submitErrorEl);
    hideEl(successEl);
  }

  emailInput.addEventListener("blur", () => {
    markTouched(emailInput);
    onFieldChange();
  });
  passwordInput.addEventListener("blur", () => {
    markTouched(passwordInput);
    onFieldChange();
  });
  emailInput.addEventListener("input", onFieldChange);
  passwordInput.addEventListener("input", onFieldChange);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    markTouched(emailInput);
    markTouched(passwordInput);
    refreshErrors();

    const emailErr = validateEmail(emailInput.value);
    const pwdErr = validateLoginPassword(passwordInput.value);
    setFieldError(emailInput, emailError, emailErr);
    setFieldError(passwordInput, passwordError, pwdErr);

    if (emailErr || pwdErr) {
      refreshSubmit();
      return;
    }

    hideEl(submitErrorEl);
    successEl.textContent = "Signed in successfully. (Demo — no server call.)";
    showEl(successEl);
    form.reset();
    resetPasswordUi(form);
    emailInput.dataset.touched = "";
    passwordInput.dataset.touched = "";
    refreshSubmit();
    emailInput.focus();
  });

  refreshSubmit();
}

/* =============================================================================
   5. SIGNUP FORM
   ============================================================================= */

function initSignupForm() {
  const form = document.getElementById("signup-form-element");
  const nameInput = document.getElementById("signup-name");
  const emailInput = document.getElementById("signup-email");
  const passwordInput = document.getElementById("signup-password");
  const confirmInput = document.getElementById("signup-confirm-password");
  const nameError = document.getElementById("signup-name-error");
  const emailError = document.getElementById("signup-email-error");
  const passwordError = document.getElementById("signup-password-error");
  const confirmError = document.getElementById("signup-confirm-password-error");
  const submitBtn = document.getElementById("signup-submit");
  const successEl = document.getElementById("signup-success");

  function refreshErrors() {
    const showName = isTouched(nameInput) || nameInput.value.length > 0;
    const showEmail = isTouched(emailInput) || emailInput.value.length > 0;
    const showPwd = isTouched(passwordInput) || passwordInput.value.length > 0;
    const showConfirm =
      isTouched(confirmInput) || confirmInput.value.length > 0;

    setFieldError(
      nameInput,
      nameError,
      showName ? validateName(nameInput.value) : null
    );
    setFieldError(
      emailInput,
      emailError,
      showEmail ? validateEmail(emailInput.value) : null
    );
    setFieldError(
      passwordInput,
      passwordError,
      showPwd ? validateSignupPassword(passwordInput.value) : null
    );
    const pwd = passwordInput.value;
    setFieldError(
      confirmInput,
      confirmError,
      showConfirm ? validateConfirmPassword(pwd, confirmInput.value) : null
    );
  }

  function refreshSubmit() {
    submitBtn.disabled = !signupFormIsValid(
      nameInput,
      emailInput,
      passwordInput,
      confirmInput
    );
  }

  function onFieldChange() {
    refreshErrors();
    refreshSubmit();
    hideEl(successEl);
  }

  [nameInput, emailInput, passwordInput, confirmInput].forEach((input) => {
    input.addEventListener("blur", () => {
      markTouched(input);
      onFieldChange();
    });
    input.addEventListener("input", () => {
      if (input === passwordInput && confirmInput.value) {
        markTouched(confirmInput);
      }
      onFieldChange();
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    [nameInput, emailInput, passwordInput, confirmInput].forEach(markTouched);
    refreshErrors();

    const nErr = validateName(nameInput.value);
    const eErr = validateEmail(emailInput.value);
    const pErr = validateSignupPassword(passwordInput.value);
    const cErr = validateConfirmPassword(
      passwordInput.value,
      confirmInput.value
    );

    setFieldError(nameInput, nameError, nErr);
    setFieldError(emailInput, emailError, eErr);
    setFieldError(passwordInput, passwordError, pErr);
    setFieldError(confirmInput, confirmError, cErr);

    if (nErr || eErr || pErr || cErr) {
      refreshSubmit();
      return;
    }

    successEl.textContent =
      "Account created successfully. (Demo — no server call.)";
    showEl(successEl);
    form.reset();
    resetPasswordUi(form);
    [nameInput, emailInput, passwordInput, confirmInput].forEach((el) => {
      el.dataset.touched = "";
    });
    refreshSubmit();
    nameInput.focus();
  });

  refreshSubmit();
}

/* =============================================================================
   6. PASSWORD VISIBILITY
   ============================================================================= */

function initPasswordToggles() {
  document.querySelectorAll(".toggle-password").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-target");
      const input = document.getElementById(id);
      if (!input) return;

      const visible = input.type === "text";
      input.type = visible ? "password" : "text";
      btn.setAttribute("aria-pressed", visible ? "false" : "true");
      btn.setAttribute(
        "aria-label",
        visible ? "Show password" : "Hide password"
      );
    });
  });
}

/* =============================================================================
   7. SWITCH LOGIN ↔ SIGNUP
   ============================================================================= */

function showSignup() {
  const loginSection = document.getElementById("login-section");
  const signupSection = document.getElementById("signup-section");
  hideEl(document.getElementById("login-success"));
  hideEl(document.getElementById("login-submit-error"));
  loginSection.hidden = true;
  signupSection.hidden = false;
  document.getElementById("signup-name").focus();
}

function showLogin() {
  const loginSection = document.getElementById("login-section");
  const signupSection = document.getElementById("signup-section");
  hideEl(document.getElementById("signup-success"));
  signupSection.hidden = true;
  loginSection.hidden = false;
  document.getElementById("login-email").focus();
}

function initViewSwitching() {
  document.getElementById("go-to-signup").addEventListener("click", showSignup);
  document.getElementById("go-to-login").addEventListener("click", showLogin);
}

/* =============================================================================
   BOOT
   ============================================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initPasswordToggles();
  initViewSwitching();
  initLoginForm();
  initSignupForm();
});
