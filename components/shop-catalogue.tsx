'use client';

import {useMemo, useState} from 'react';
import {Code2, Search, ShoppingBag, X} from 'lucide-react';
import type {SoftwareProject} from '@/lib/shopify';
import {projectPrice} from './software-card';

const departments = ['All departments', 'IT', 'AI & Data Science', 'B.Sc Computer Science', 'BCA', 'MCA', 'Computer Science'];
const budgets = ['1000', '2000', '3500', '5000'];

export function ShopCatalogue({projects, unavailable, initialQuery, initialDepartment, initialMaxPrice}: {
  projects: SoftwareProject[];
  unavailable: boolean;
  initialQuery: string;
  initialDepartment: string;
  initialMaxPrice: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [department, setDepartment] = useState(departments.includes(initialDepartment) ? initialDepartment : departments[0]);
  const [budget, setBudget] = useState(budgets.includes(initialMaxPrice) ? initialMaxPrice : '');
  const [sort, setSort] = useState('title');
  const hasFilters = Boolean(query || department !== departments[0] || budget);
  const filtered = useMemo(() => projects.filter(project => {
    const text = `${project.title} ${project.description} ${project.tags.join(' ')}`.toLowerCase();
    const price = Number(project.variants.nodes[0]?.price.amount);
    return text.includes(query.toLowerCase().trim())
      && (department === departments[0] || project.tags.includes(`department:${department}`))
      && (!budget || price <= Number(budget));
  }).sort((a, b) => sort === 'low'
    ? Number(a.variants.nodes[0]?.price.amount) - Number(b.variants.nodes[0]?.price.amount)
    : sort === 'high'
      ? Number(b.variants.nodes[0]?.price.amount) - Number(a.variants.nodes[0]?.price.amount)
      : a.title.localeCompare(b.title)), [projects, query, department, budget, sort]);

  function clearFilters() {
    setQuery('');
    setDepartment(departments[0]);
    setBudget('');
  }

  return <div className="project-catalogue">
    <div className="catalogue-heading">
      <div><h1>Software projects<span>{projects.length}</span></h1>
        <p>Source code & setup guide. Download after payment approval.</p></div>
      <a className="catalogue-contact" href="/contact?type=Custom%20Project">Need a custom project?</a>
    </div>

    <div className="catalogue-departments" role="group" aria-label="Filter by department">
      {departments.map(value => <button type="button" key={value} aria-pressed={department === value}
        onClick={() => setDepartment(value)}>{value === departments[0] ? 'All projects' : value}</button>)}
    </div>

    <div className="catalogue-toolbar">
      <label className="catalogue-search"><Search size={20} aria-hidden="true"/>
        <span className="sr-only">Search projects</span>
        <input type="search" placeholder="Search projects or technologies" value={query} maxLength={100}
          onChange={event => setQuery(event.target.value)}/>
      </label>
      <label className="catalogue-select"><span>Budget</span>
        <select aria-label="Maximum price" value={budget} onChange={event => setBudget(event.target.value)}>
          <option value="">All prices</option>
          {budgets.map(value => <option key={value} value={value}>Up to ₹{Number(value).toLocaleString('en-IN')}</option>)}
        </select>
      </label>
      <label className="catalogue-select"><span>Sort by</span>
        <select aria-label="Sort projects" value={sort} onChange={event => setSort(event.target.value)}>
          <option value="title">Project name</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option>
        </select>
      </label>
    </div>

    <div className="catalogue-summary">
      <p role="status" aria-live="polite">{unavailable ? 'Catalogue unavailable' : `${filtered.length} ${filtered.length === 1 ? 'project' : 'projects'}${hasFilters ? ' found' : ''}`}</p>
      {hasFilters && <button type="button" onClick={clearFilters}><X size={15} aria-hidden="true"/>Clear filters</button>}
    </div>

    {filtered.length > 0 ? <div className="catalogue-grid">{filtered.map(project => <ShopProjectCard key={project.id} project={project}/>)}</div>
      : <div className="catalogue-empty"><Search size={32} aria-hidden="true"/>
        <h2>{unavailable ? 'Projects are temporarily unavailable' : 'No projects found'}</h2>
        <p>{unavailable ? 'Please try again shortly.' : 'Try a different search or clear your filters.'}</p>
        {hasFilters && <button type="button" className="btn btn-primary" onClick={clearFilters}>Clear filters</button>}
        <a href="/contact">Contact Bebin Tech</a>
      </div>}
  </div>;
}

export function ShopProjectCard({project}: {project: SoftwareProject}) {
  const image = project.images.nodes[0];
  const technologies = project.tags.filter(tag => tag.startsWith('technology:')).map(tag => tag.slice(11));
  const available = project.variants.nodes[0]?.availableForSale;
  const href = `/projects/${project.handle}`;
  const category = project.tags.includes('department:AI & Data Science') ? 'AI & Data Science'
    : project.tags.some(tag => /flutter|android|react native/i.test(tag)) ? 'Mobile application' : 'Web application';
  return <article className="catalogue-card">
    <a className="catalogue-preview" href={href} aria-label={`View ${project.title}`}>
      {image ? <img src={image.url} alt={image.altText || `${project.title} preview`} width={1000} height={600} loading="lazy"/> : <Code2 size={54} aria-hidden="true"/>}
    </a>
    <div className="catalogue-card-body">
      <span className="catalogue-category">{category}</span>
      <h2><a href={href}>{project.title}</a></h2>
      <div className="catalogue-technologies">{technologies.slice(0, 3).map(technology => <span key={technology}>{technology}</span>)}</div>
      <div className="catalogue-price"><strong>{projectPrice(project)}</strong><span>{project.handle==='billing-software-pro'?'In-progress source package':'Source code package'}</span></div>
      <div className="catalogue-actions"><a href={href} className="catalogue-details">View details</a>
        <a href={`${href}${available ? '#purchase' : ''}`} className="catalogue-buy"><ShoppingBag size={17} aria-hidden="true"/>{available ? 'Buy now' : 'Enquire'}</a></div>
    </div>
  </article>;
}
