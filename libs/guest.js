const GUEST_ID_KEY = "guestId";

export function getGuestId() {
  if (typeof window === "undefined") return null;
  try {
    let id = localStorage.getItem(GUEST_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(GUEST_ID_KEY, id);
    }
    return id;
  } catch (_) {
    return null;
  }
}

export function getGuestHeaders() {
  const guestId = getGuestId();
  return guestId ? { "X-Guest-Id": guestId } : {};
}

