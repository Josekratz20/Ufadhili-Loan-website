function togglePassword(id, iconId) {
  const passwordField = document.getElementById(id);
  const icon = document.getElementById(iconId);
  if (passwordField.type === "password") {
    passwordField.type = "text";
    icon.textContent = "🙈";
  } else {
    passwordField.type = "password";
    icon.textContent = "👁️";
  }
}
