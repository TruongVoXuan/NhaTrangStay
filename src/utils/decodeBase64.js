export const decodeBase64 = (token) => {
  if (!token) {
    return;
  }
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    const name = JSON.parse(jsonPayload);
    return name;
  } catch (error) {
    // console.log("Token không hợp lệ để giải mã");
    return ;
  }
};