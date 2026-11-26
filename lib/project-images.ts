// Captured from the actual packaged applications, 26 November 2026.
// Real feature screens with demonstration data; no customer records are exposed.
export const projectScreenshotViews:Record<string,string>={
  'college-parking':'parking dashboard (built-in demonstration data)',
  'company-management':'management dashboard (built-in demonstration metrics)',
  'event-booking':'booking and revenue dashboard (demonstration records)',
  'healthwise-ai':'generated wellness results (demonstration profile)',
  'placement-app':'placement officer dashboard (demonstration records)',
  'smart-energy':'energy dashboard (built-in demonstration metrics)',
  'visitor-management':'visitor activity dashboard (demonstration records)',
  'soil-ai':'farm and soil records dashboard (demonstration records)',
  'electricity-usage-analyzer':'consumption dashboard (synthetic demonstration readings)',
  'weather-app':'weather dashboard (labelled synthetic offline forecast)',
  'billing-software-pro':'service billing dashboard (demonstration invoices)',
};

export function projectScreenshot(handle:string,title:string){
  const view=projectScreenshotViews[handle];
  return view?{url:`/project-screenshots/${handle}.jpg`,altText:`${title} — actual application screenshot: ${view}`}:undefined;
}
