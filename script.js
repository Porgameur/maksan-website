// Jaar in footer
document.getElementById("year").textContent = new Date().getFullYear();

const form = document.getElementById("contactForm");
const statusEl = document.getElementById("formStatus");
const emailField = document.getElementById("emailField");

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
}

function setStatus(msg) {
  statusEl.textContent = msg;
}

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setStatus("");

    if (!form.checkValidity()) {
      form.reportValidity();
      setStatus("Controleer de velden: alles moet correct ingevuld zijn.");
      return;
    }

    if (!isValidEmail(emailField.value.trim())) {
      emailField.focus();
      setStatus("Vul een geldig e-mailadres in (bv. naam@domein.be).");
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Bezig met versturen...";

    try {
      const data = new FormData(form);

      const response = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        window.location.href = "bedankt.html?status=ok";
      } else {
        let msg = "Er ging iets mis. Probeer opnieuw of mail ons rechtstreeks.";
        try {
          const result = await response.json();
          if (result?.errors?.length) {
            msg = result.errors.map((e) => e.message).join(" ");
          }
        } catch {}
        window.location.href =
          "bedankt.html?status=fail&msg=" + encodeURIComponent(msg);
      }
    } catch {
      window.location.href =
        "bedankt.html?status=fail&msg=" +
        encodeURIComponent("Geen verbinding. Probeer later opnieuw.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Versturen";
    }
  });
}
