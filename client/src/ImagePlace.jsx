import Image from "./Image.jsx";

export default function PlaceImg({place,index=0,className=null}) {
  if (!place.photos?.length) {
    return '';
  }
  if (!className) {
    className = 'object-cover aspect-square rounded-lg';
  }
  return (
    <Image className="object-cover aspect-square rounded-lg" src={place.photos[index]} alt=""/>
  );
}