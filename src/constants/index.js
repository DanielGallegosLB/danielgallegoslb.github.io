import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  docker,
  meta,
  starbucks,
  tesla,
  shopify,
  carrent,
  jobit,
  tripguide,
  threejs,
  udla,
  fid,
  ipractica,
  ecommerce,
  krapygames,
} from "../assets";

export const navLinks = [
  {
    id: "resumen",
    title: "Resumen",
  },
  {
    id: "trabajo",
    title: "Trabajo",
  },
  {
    id: "contacto",
    title: "Contacto",
  },
];

const services = [
  {
    title: "Desarrollador Web Full-Stack",
    icon: web,
  },
  {
    title: "Arquitecto de Software",
    icon: mobile,
  },
  {
    title: "Ingeniero DevOps",
    icon: backend,
  },
  {
    title: "Desarrollador de API",
    icon: creator,
  },
];

const technologies = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Redux Toolkit",
    icon: redux,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "Three JS",
    icon: threejs,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "figma",
    icon: figma,
  },
  {
    name: "docker",
    icon: docker,
  },
];

const experiences = [
  {
    title: "Full-stack Software Developer",
    company_name: "Núcleo de Investigación de Data Science (NIDS)",
    icon: udla,
    iconBg: "#E6DEDD",
    date: "Enero 2023 - Marzo 2023",
    points: [
      "Generación de aplicación para solicitar datos de contribuyentes al SII.",
      "Desarrollo de página para cálculo de impuestos utilizando Javascript, HTML y CSS.",
      "Documentación completa del proyecto."
    ],
  },
  {
    title: "Data Engineer",
    company_name: "FID Chile Seguros Generales S.A.",
    icon: fid,
    iconBg: "#E6DEDD",
    date: "Enero 2023 - Abril 2024",
    points: [
      "Contribuí con 5 GB de datos sobre potenciales clientes y riesgos relacionados con pólizas de automóviles.",
      "Implementé ejecuciones escalables y automatizadas de extractores utilizando Google Cloud Platform, Docker y Selenium.",
      "Elaboré documentación completa para los proyectos."
    ],
  },
  
];


const testimonials = [
  {
    testimonial:
      "Trabajar con Daniel fue una experiencia excepcional. Su habilidad para transformar nuestras ideas en una plataforma funcional y atractiva superó todas nuestras expectativas.",
    name: "Juan Pérez",
    designation: "CEO",
    company: "Tech Innovators",
    image: "https://randomuser.me/api/portraits/men/10.jpg",
  },
  {
    testimonial:
      "Daniel no solo creó una página web increíble para nosotros, sino que también nos ayudó a entender mejor nuestras necesidades tecnológicas. Su compromiso con el éxito del proyecto fue inspirador.",
    name: "María González",
    designation: "Directora de Marketing",
    company: "Market Solutions",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
  },
  {
    testimonial:
      "Gracias a Daniel, nuestro sitio de e-commerce ahora es rápido, eficiente y fácil de usar. Las ventas han aumentado un 40% desde que implementamos sus mejoras.",
    name: "Carlos Ramírez",
    designation: "Gerente de Ventas",
    company: "Online Retailers",
    image: "https://randomuser.me/api/portraits/men/12.jpg",
  },
];

const projects = [
  {
    name: "Plataforma de Gestión de Prácticas",
    description:
      "Desarrollé y diseñé una plataforma web que gestiona las prácticas profesionales de la Facultad de Ingeniería de la Universidad de las Américas. La plataforma facilita la administración de estudiantes y profesores, brindando un sistema automatizado que soporta las necesidades de más de 10,000 estudiantes y 500 profesores.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "tailwind",
        color: "pink-text-gradient",
      },
      {
        name: "mongodb",
        color: "green-text-gradient",
      },
    ],
    image: ipractica,
    source_code_link: "https://github.com/DanielGallegosLB/19-Frontend-source",
    page_link: "https://19-frontend.vercel.app/",
  },
  {
    name: "Comparador de Precios de Juegos",
    description:
      "Desarrollé una página web para comparar precios de tiendas de juegos digitales en Chile. Trabajé principalmente en el frontend para conectar las rutas del backend y ofrecer una interfaz responsiva que facilita la búsqueda y comparación de precios en tiempo real.",
    tags: [
      {
        name: "nextjs",
        color: "blue-text-gradient",
      },
      {
        name: "tailwind",
        color: "pink-text-gradient",
      },
      {
        name: "nodejs",
        color: "green-text-gradient",
      },
    ],
    image: krapygames,
    
  },
  {
    name: "E-Commerce Store",
    description:
      "Plataforma de comercio electrónico que permite a los usuarios navegar por productos, agregar artículos al carrito y realizar compras de manera segura. Incluye un sistema de gestión de inventario para los vendedores y opciones de pago integradas para los compradores.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "redux",
        color: "purple-text-gradient",
      },
      {
        name: "nodejs",
        color: "green-text-gradient",
      },
    ],
    image: ecommerce,
  }
];


export { services, technologies, experiences, testimonials, projects };
