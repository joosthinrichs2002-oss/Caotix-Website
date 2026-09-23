/*
 * CAOTIX SHOW-LOGIK – normalerweise nicht bearbeiten.
 * Termine werden in content.js unter "shows" gepflegt.
 */

(() => {
  const shows = Array.isArray(window.CAOTIX_CONTENT?.shows) ? window.CAOTIX_CONTENT.shows : [];
  const L = window.CAOTIX_CONTENT?.livePage || {};
  const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const statusLabels = {
    soldout: "SOLD OUT",
    cancelled: "CANCELLED",
    postponed: "POSTPONED",
    ...(L.statusLabels || {})
  };

  const parseLocalDate = (dateString) => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(dateString || ""));
    if (!match) return null;
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
    return date;
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const normalized = shows.flatMap(show => {
    if (!show) return [];
    const parsed = parseLocalDate(show.date);
    if (!parsed) {
      console.warn('[CAOTIX] Ungültiges Show-Datum übersprungen:', show.date, show.title || show);
      return [];
    }
    return [{ ...show, _date: parsed }];
  });

  const upcoming = normalized
    .filter(show => show._date >= today)
    .sort((a, b) => a._date - b._date);

  const past = normalized
    .filter(show => show._date < today)
    .sort((a, b) => b._date - a._date);

  const dateMarkup = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} <small>${year}</small>`;
  };

  const placeText = (show) => [show.venue, show.city].filter(Boolean).join(" · ");
  const explicitStatus = (show) => String(show.status || "").trim().toLowerCase();
  const displayStatus = (show) => explicitStatus(show);

  const makeShowRow = (show, isPast = false) => {
    const row = document.createElement("div");
    row.className = `show simple-show${isPast ? " past-show" : ""}`;

    const date = document.createElement("div");
    date.className = "date-big";
    date.innerHTML = dateMarkup(show._date);

    const info = document.createElement("div");
    info.className = "show-main";
    const title = document.createElement("div");
    title.className = "show-title";
    title.textContent = show.title || "CAOTIX LIVE";

    info.append(title);

    if (show.time) {
      const time = document.createElement("div");
      time.className = "show-time";
      time.textContent = show.time;
      info.append(time);
    }

    const place = document.createElement("div");
    place.className = "show-place";
    place.textContent = placeText(show);
    info.append(place);

    const actions = document.createElement("div");
    actions.className = "show-actions";

    if (show.admission) {
      const admission = document.createElement("span");
      admission.className = "show-admission";
      admission.textContent = show.admission;
      actions.append(admission);
    }

    const status = displayStatus(show, isPast);
    if (status && statusLabels[status]) {
      const badge = document.createElement("span");
      badge.className = `show-status status-${status}`;
      badge.textContent = statusLabels[status];
      actions.append(badge);
    }

    if (!isPast) {
      const blocksTicket = ["soldout", "cancelled", "postponed"].includes(status);
      const href = !blocksTicket && show.ticket ? show.ticket : (show.info || "");
      if (href) {
        const link = document.createElement("a");
        link.className = "show-ticket";
        link.href = href;
        link.target = "_blank";
        link.rel = "noopener";
        link.textContent = !blocksTicket && show.ticket ? (L.ticketText || "GET TICKETS ↗") : (L.infoText || "MORE INFO ↗");
        actions.append(link);
      } else if (L.noLinkText) {
        const note = document.createElement("span");
        note.className = "show-link-fallback";
        note.textContent = L.noLinkText;
        actions.append(note);
      }
    }

    row.append(date, info);
    if (actions.childElementCount) row.append(actions);
    return row;
  };

  const PAST_INITIAL_COUNT = 30;
  const PAST_LOAD_MORE_COUNT = 20;

  const renderLivePage = () => {
    const upcomingRoot = document.querySelector("[data-upcoming-shows]");
    const pastRoot = document.querySelector("[data-past-shows]");
    if (!upcomingRoot || !pastRoot) return;

    upcomingRoot.replaceChildren();
    pastRoot.replaceChildren();

    if (upcoming.length) {
      upcoming.forEach(show => upcomingRoot.append(makeShowRow(show, false)));
    } else {
      const empty = document.createElement("div");
      empty.className = "show-empty";
      empty.innerHTML = `${L.emptyUpcomingHeadline || "NO DATES LOCKED IN."}<br><span>${L.emptyUpcomingText || "More damage soon."}</span>`;
      upcomingRoot.append(empty);
    }

    if (past.length) {
      let visiblePastCount = Math.min(PAST_INITIAL_COUNT, past.length);

      const appendPastShows = (from, to) => {
        past.slice(from, to).forEach(show => pastRoot.append(makeShowRow(show, true)));
      };

      appendPastShows(0, visiblePastCount);

      if (past.length > PAST_INITIAL_COUNT) {
        const moreWrap = document.createElement("div");
        moreWrap.className = "show-more-wrap";

        const moreButton = document.createElement("button");
        moreButton.type = "button";
        moreButton.className = "btn show-more-damage";
        moreButton.textContent = L.showMoreText || "SHOW MORE DAMAGE";

        moreButton.addEventListener("click", () => {
          const previousCount = visiblePastCount;
          visiblePastCount = Math.min(visiblePastCount + PAST_LOAD_MORE_COUNT, past.length);
          appendPastShows(previousCount, visiblePastCount);

          if (visiblePastCount >= past.length) {
            moreWrap.remove();
          }
        });

        moreWrap.append(moreButton);
        pastRoot.after(moreWrap);
      }
    } else {
      const empty = document.createElement("div");
      empty.className = "show-empty past-empty";
      empty.textContent = L.emptyPastText || "Nothing here yet.";
      pastRoot.append(empty);
    }
  };

  const renderNextShow = () => {
    const strip = document.querySelector("[data-next-show]");
    if (!strip) return;

    const next = upcoming.find(show => !["cancelled", "postponed"].includes(explicitStatus(show)));
    const date = strip.querySelector("[data-next-show-date]");
    const title = strip.querySelector("[data-next-show-title]");
    const place = strip.querySelector("[data-next-show-place]");
    const statusNode = strip.querySelector("[data-next-show-status]");
    const button = strip.querySelector("[data-next-show-link]");

    if (!next) {
      if (date) date.innerHTML = `${L.homeNoDatesDate || "TBA"} <span>${L.homeNoDatesYear || "SOON"}</span>`;
      if (title) title.textContent = L.homeNoDatesTitle || "New dates incoming";
      if (place) place.textContent = L.homeNoDatesPlace || "Keep an eye on the live page.";
      if (statusNode) statusNode.hidden = true;
      if (button) {
        button.href = "live.html";
        button.textContent = L.homeNoDatesButton || "Live page";
        button.removeAttribute("target");
        button.removeAttribute("rel");
      }
      return;
    }

    if (date) {
      const day = String(next._date.getDate()).padStart(2, "0");
      date.innerHTML = `${day} ${monthNames[next._date.getMonth()]} <span>${next._date.getFullYear()}</span>`;
    }
    if (title) title.textContent = next.title || "CAOTIX LIVE";
    if (place) {
      const parts = [next.time, placeText(next), next.admission].filter(Boolean);
      place.textContent = parts.join(" · ");
    }

    const status = displayStatus(next, false);
    if (statusNode) {
      if (status && statusLabels[status]) {
        statusNode.textContent = statusLabels[status];
        statusNode.className = `next-show-status status-${status}`;
        statusNode.hidden = false;
      } else {
        statusNode.hidden = true;
      }
    }

    if (button) {
      const blocksTicket = ["soldout", "cancelled", "postponed"].includes(status);
      const href = !blocksTicket && next.ticket ? next.ticket : (next.info || "live.html");
      button.href = href;
      button.textContent = !blocksTicket && next.ticket
        ? (L.homeTicketText || "Get tickets")
        : next.info
          ? (L.homeInfoText || "More info")
          : (L.homeFallbackText || "Show details");
      if ((!blocksTicket && next.ticket) || next.info) {
        button.target = "_blank";
        button.rel = "noopener";
      } else {
        button.removeAttribute("target");
        button.removeAttribute("rel");
      }
    }
  };

  renderLivePage();
  renderNextShow();
})();
