export default function Image({src,...rest}) {
  const baseUrl = "http://localhost:4000/";
  src = src && src.includes("https://") ? src : baseUrl + "Uploads/" + src;
  return <img {...rest} src={src} alt={""} />;
}