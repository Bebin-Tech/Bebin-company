export type Kind = 'project' | 'product' | 'service' | 'technology';
export type Item = { id:string; kind:Kind; title:string; category:string; description:string; price:number|null; image:string; published:boolean; position:number; stack:string[]; features:string[]; technologies:string[]; icon:string; delivery:string; createdAt?:string; updatedAt?:string };
export type Company = { name:string; tagline:string; about:string; email:string; phone:string; whatsapp:string; founder:string; founderRole:string; biography:string; founderImage:string; support:string; sourcePolicy:string };
export type SiteData = { items:Item[]; company:Company; initialized:boolean };
export const defaultCompany:Company = { name:'Bebin Tech', tagline:'Innovative Software Solutions for Students and Businesses.', about:'Bebin Tech provides innovative software solutions for students, colleges, startups, and businesses. From academic project guidance to custom applications and ERP systems, we turn ideas into practical, thoughtfully designed software.', email:'bbebinr@gmail.com', phone:'8807336368', whatsapp:'918807336368', founder:'Bebin R', founderRole:'Founder & Software Developer', biography:'Bebin R is the founder and software developer behind Bebin Tech, specializing in web development, mobile app development, custom software, and ERP solutions. His focus is on building practical applications and helping students and businesses bring their ideas to life.', founderImage:'', support:'Technical support and project guidance are available as agreed in your selected package.', sourcePolicy:'Source code, documentation, demonstrations, and support depend on the selected package. Confirm all inclusions before ordering.' };
const serviceDefs = [
 ['Web Development','Web','Business websites, portfolio websites, and custom web applications.','globe'],
 ['Mobile App Development','Mobile','Android applications and custom mobile apps, designed around your users.','smartphone'],
 ['Software Development','Software','Custom software solutions built around different business needs.','code'],
 ['Final-Year Projects','Academic','Ready-made and customized final-year project solutions for college students.','graduation'],
 ['College Projects','Academic','Academic projects with source code, documentation, and demonstrations where available.','book'],
 ['ERP Software','Enterprise','College ERP, staff management, student management, and business ERP solutions.','layers'],
 ['AI & Machine Learning Projects','AI & ML','AI-based applications, machine learning projects, and data-driven solutions.','brain'],
 ['Project Customization','Customization','Modify existing projects to match your requirements, features, and technology choices.','settings'],
];
const technologyDefs = [
 ['Python','Programming Languages','Automation, AI, machine learning, data science, backend development, and web applications.','PY','Python,AI & ML,Web'],
 ['Java','Programming Languages','Enterprise applications, object-oriented projects, and backend solutions.','JV','Java,Web'],
 ['PHP','Programming Languages','PHP and MySQL applications, dynamic websites, portals, and database-driven projects.','PHP','Web'],
 ['C','Programming Languages','Academic programming, algorithms, data structures, and systems programming.','C','C'],
 ['C++','Programming Languages','Object-oriented programming, algorithms, data structures, and applications.','C++','C++'],
 ['C#','Programming Languages','Desktop applications, business software, and .NET development.','C#','Software'],
 ['JavaScript','Programming Languages','Interactive websites, backend applications, and full-stack projects.','JS','Web'],
 ['TypeScript','Programming Languages','Scalable web applications and modern frontend and backend development.','TS','Web'],
 ['HTML5 & CSS3','Programming Languages','Responsive websites, modern interfaces, landing pages, and portfolios.','</>','Web'],
 ['SQL & MySQL','Programming Languages','Database design, data management, reporting, and database applications.','SQL','Web,Software'],
 ['R Programming','Programming Languages','Statistics, data visualization, research projects, and data science.','R','AI & ML'],
 ['ASP.NET','Web Development','Enterprise web applications and business software.','.NET','Web'],
 ['.NET & ASP.NET MVC','Web Development','MVC applications, secure portals, and enterprise development.','MVC','Web'],
 ['Django','Web Development','Python web applications, admin dashboards, and management systems.','DJ','Python,Web'],
 ['Flask','Web Development','Lightweight web applications, APIs, and custom software.','FL','Python,Web'],
 ['React.js','Web Development','Modern interactive frontend applications and dashboards.','RE','Web'],
 ['Node.js & Express.js','Web Development','Backend development, REST APIs, and full-stack applications.','N','Web'],
 ['Laravel','Web Development','PHP applications, portals, and management systems.','LA','Web'],
 ['Android Development','Mobile Development','Android apps, academic projects, and practical mobile solutions.','AD','Mobile'],
 ['Kotlin','Mobile Development','Native Android applications and modern mobile development.','KT','Mobile'],
 ['Java for Android','Mobile Development','Android applications and academic mobile project development.','JV','Mobile'],
 ['Swift','Mobile Development','Native iOS applications for iPhone and iPad.','SW','Mobile'],
 ['Flutter & Dart','Mobile Development','Cross-platform applications for Android and iOS.','FD','Mobile'],
 ['React Native','Mobile Development','Cross-platform mobile applications using JavaScript and React.','RN','Mobile'],
 ['Machine Learning','AI & ML','Prediction, classification, regression, and recommendation systems.','ML','AI & ML'],
 ['Artificial Intelligence','AI & ML','AI-powered applications, intelligent automation, and smart software.','AI','AI & ML'],
 ['Deep Learning','AI & ML','Neural networks, image recognition, and advanced AI applications.','DL','AI & ML'],
 ['Data Science','AI & ML','Analysis, visualization, statistical modeling, and predictive analytics.','DS','AI & ML'],
 ['Computer Vision','AI & ML','Image processing, object detection, and image classification.','CV','AI & ML'],
 ['Natural Language Processing','AI & ML','Text analysis, chatbots, and language-based applications.','NLP','AI & ML'],
 ['MySQL','Databases','Relational databases for web applications and business systems.','MY','Web,Software'],
 ['PostgreSQL','Databases','Relational data storage, reporting, and scalable applications.','PG','Web,Software'],
 ['SQLite','Databases','Lightweight databases for mobile, desktop, and academic projects.','SQ','Mobile,Software'],
 ['Microsoft SQL Server','Databases','Enterprise databases, reporting, and .NET business applications.','MS','Software'],
 ['MongoDB','Databases','Document databases for modern web and mobile applications.','MO','Web,Mobile'],
 ['Firebase','Databases','App data, realtime features, and mobile application backends.','FB','Web,Mobile'],
 ['College ERP Software','Enterprise Solutions','Connected administration for colleges and academic institutions.','ERP','ERP'],
 ['Student Management Systems','Enterprise Solutions','Student records, academic information, and administrative workflows.','SMS','ERP'],
 ['Staff & Faculty Management','Enterprise Solutions','Staff records, faculty administration, and management workflows.','HR','ERP'],
 ['Attendance Management','Enterprise Solutions','Attendance tracking, records, and reporting.','AT','ERP'],
 ['Timetable Management','Enterprise Solutions','Academic scheduling and timetable management.','TT','ERP'],
 ['Inventory & Billing Software','Enterprise Solutions','Inventory records, billing, and business workflows.','IB','ERP'],
 ['Business Management Systems','Enterprise Solutions','Custom systems for operational and business management.','BM','ERP'],
 ['Custom Web & Mobile Applications','Enterprise Solutions','Applications tailored to the needs of your business.','APP','Web,Mobile'],
];
export const defaultItems:Item[] = [
 ...serviceDefs.map(([title,category,description,icon],i)=>({id:'service-'+i,kind:'service' as Kind,title,category,description,icon,price:null,image:'',published:true,position:i,stack:[],features:[],technologies:[],delivery:''})),
 ...technologyDefs.map(([title,category,description,icon,categories],i)=>({id:'technology-'+i,kind:'technology' as Kind,title,category,description,icon,price:null,image:'',published:true,position:i,stack:[],features:categories.split(','),technologies:[],delivery:''})),
];
export const categories=['Web','Mobile','AI & ML','Python','Java','C','C++','Software','ERP','Other'];
export const technologyCategories=['Programming Languages','Web Development','Mobile Development','AI & ML','Databases','Enterprise Solutions'];
export function money(value:number|null){return value===null?'Price on enquiry':new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2}).format(value/100);}
export function whatsApp(company:Company,message:string){return `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(message)}`;}
