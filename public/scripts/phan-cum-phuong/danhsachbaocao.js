const reports = document.querySelectorAll("#main__list div.card.shadow-sm.report");

reports.forEach(e => {
  const id = e.id.slice(10);
  e.style.cursor = "pointer";
  e.addEventListener("click", () => {
    window.location.href = "/dashboard/report/" + id;
  })
});
