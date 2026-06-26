const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector("#site-menu");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navLinks.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const compareRange = document.querySelector("#compare-range");
const compareVisual = document.querySelector(".compare-visual");

if (compareRange && compareVisual) {
  compareRange.addEventListener("input", () => {
    compareVisual.style.setProperty("--reveal", `${compareRange.value}%`);
  });
}

const quoteForm = document.querySelector("#quote-form");
const formStatus = document.querySelector("#form-status");

if (quoteForm && formStatus) {
  quoteForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = quoteForm.querySelector("[type='submit']");
    submitButton.disabled = true;
    formStatus.textContent = "Sending estimate request...";

    try {
      const response = await fetch(quoteForm.action, {
        method: "POST",
        body: new FormData(quoteForm),
        headers: { Accept: "application/json" },
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.ok === false) {
        throw new Error(result.message || "The estimate request could not be sent.");
      }

      quoteForm.reset();
      formStatus.textContent = result.message || "Thanks. We received your request.";
    } catch (error) {
      formStatus.textContent =
        error.message || "Something went wrong. Call 904-891-1355 to reach us directly.";
    } finally {
      submitButton.disabled = false;
    }
  });
}
