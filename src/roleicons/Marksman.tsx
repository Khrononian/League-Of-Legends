import React from "react"; 

const ArcherIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={32} height={32} color={"#c8aa6e"} fill={"none"} {...props}>
    <path d="M11 17.0294L20 21C19.4444 20.4444 18.4898 18.6435 19.1158 15.8842C19.8982 12.4351 21.3667 8.96668 15.9368 7.06317C14.0333 1.63335 10.5649 3.10176 7.11578 3.88422C4.35649 4.51018 2.55556 3.55556 2 3L6 12.0741" stroke="#c8aa6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
    <path d="M5 18H2L5 15H8V18L5 21V18Z" stroke="#c8aa6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
    <path d="M8 15L20 3" stroke="#c8aa6e" strokeWidth="2" strokeLinejoin="round"></path>
    <path d="M17 3H19C19.4714 3 19.7071 3 19.8536 3.14645C20 3.29289 20 3.5286 20 4V6" stroke="#c8aa6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
  </svg>
);

export default ArcherIcon;