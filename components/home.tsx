import type {SiteData} from '@/lib/models';
import type {SoftwareProject} from '@/lib/shopify';
import {Header, Footer} from './site';
import {projectPrice} from './software-card';
import {ShopProjectCard} from './shop-catalogue';
import {BrainCircuit, Code2, GraduationCap, Layers3, Smartphone, FileCode2, ShieldCheck, Mail} from 'lucide-react';

const departments = ['IT', 'AI & Data Science', 'B.Sc Computer Science', 'BCA', 'MCA', 'Computer Science'];
const services = [
  {title: 'Web development', description: 'Websites, portals, and custom web applications.', icon: Code2, type: 'Web Development'},
  {title: 'Mobile applications', description: 'Android and cross-platform applications.', icon: Smartphone, type: 'Mobile App Development'},
  {title: 'ERP & business software', description: 'Management systems built around your workflow.', icon: Layers3, type: 'ERP Software'},
];

export function ModernHome({data, projects}: {data: SiteData; projects: SoftwareProject[]}) {
  const featured = projects.find(project => project.handle === 'placement-app') || projects[0];
  const prices = projects.map(project => Number(project.variants.nodes[0]?.price.amount)).filter(price => Number.isFinite(price) && price > 0);
  const minimum = prices.length ? Math.min(...prices) : null;

  return <div className="home-refresh">
    <Header company={data.company} mode="home"/>
    <main id="main">
      <section className="home-intro">
        <div className="container home-intro-grid">
          <div className="home-intro-copy">
            <h1>Find your next<br/><span>software project.</span></h1>
            <p>Practical projects with source code, database setup, and an installation guide.</p>
            <div className="home-intro-actions"><a className="home-primary" href="/projects">Shop projects</a><a className="home-secondary" href="/contact?type=Custom%20Project">Custom development</a></div>
            {minimum !== null && <div className="home-starting-price">Projects from <strong>₹{minimum.toLocaleString('en-IN')}</strong></div>}
          </div>
          {featured ? <a className="home-feature" href={`/projects/${featured.handle}`} aria-label={`View featured project: ${featured.title}`}>
            <div className="home-feature-top"><span>Featured project</span><Code2 size={20} aria-hidden="true"/></div>
            <div className="home-feature-image">{featured.images.nodes[0]
              ? <img src={featured.images.nodes[0].url} alt={featured.images.nodes[0].altText || `${featured.title} preview`} width={1000} height={600} fetchPriority="high"/>
              : <Code2 size={72} aria-hidden="true"/>}</div>
            <div className="home-feature-bottom"><div><h2>{featured.title}</h2><span>View project details</span></div><strong>{projectPrice(featured)}</strong></div>
          </a> : <div className="home-feature-placeholder"><Code2 size={56} aria-hidden="true"/><h2>Built for your next idea</h2><a href="/contact">Discuss a project</a></div>}
        </div>
      </section>
      <section className="home-departments container" aria-label="Browse projects by department">
        <div className="home-department-label"><GraduationCap size={21} aria-hidden="true"/><span>Projects for</span></div>
        <div>{departments.map(department => <a key={department} href={`/projects?department=${encodeURIComponent(department)}`}>{department}</a>)}</div>
      </section>
      <section className="home-collection container" id="featured-projects">
        <div className="home-section-heading"><h2>Explore projects</h2><a href="/projects">View all{projects.length ? ` ${projects.length} projects` : ' projects'}</a></div>
        {projects.length ? <div className="catalogue-grid home-products-grid">{projects.slice(0, 4).map(project => <ShopProjectCard key={project.id} project={project}/>)}</div>
          : <div className="catalogue-empty"><h3>Projects are temporarily unavailable</h3><a href="/projects">Try the project store</a></div>}
        <div className="home-collection-links"><a href="/projects?maxPrice=2000">Projects up to ₹2,000</a><a href="/projects?department=AI%20%26%20Data%20Science"><BrainCircuit size={17} aria-hidden="true"/>AI & data science projects</a></div>
      </section>
      <section className="home-delivery container" aria-label="Purchase and delivery">
        <div><FileCode2 size={23} aria-hidden="true"/><span>Choose your project</span></div>
        <div><ShieldCheck size={23} aria-hidden="true"/><span>Pay with UPI · Admin verifies</span></div>
        <div><Mail size={23} aria-hidden="true"/><span>Receive your download by email</span></div>
      </section>
      <section className="home-services container">
        <div className="home-section-heading"><div><h2>Built for your business</h2><p>Need something custom? Let’s build it.</p></div><a href="/services">All services</a></div>
        <div className="home-services-grid">{services.map(service => <a key={service.title} href={`/contact?type=${encodeURIComponent(service.type)}`}>
          <span className="home-service-icon"><service.icon size={25} aria-hidden="true"/></span><h3>{service.title}</h3><p>{service.description}</p><span className="home-service-action">Discuss your requirements</span>
        </a>)}</div>
      </section>
    </main>
    <Footer company={data.company}/>
  </div>;
}
