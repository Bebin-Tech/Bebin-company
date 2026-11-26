// Captured from the actual packaged applications, 26 November 2026.
// Login screens are identified explicitly; no dashboard or feature is invented.
export const projectScreenshotViews:Record<string,string>={
  'college-parking':'parking dashboard (built-in demonstration data)',
  'company-management':'sign-in screen',
  'event-booking':'sign-in screen',
  'healthwise-ai':'health profile input screen (demonstration profile)',
  'placement-app':'sign-in screen',
  'smart-energy':'sign-in screen',
  'visitor-management':'sign-in screen',
  'soil-ai':'sign-in screen',
  'electricity-usage-analyzer':'sign-in screen',
};

export function projectScreenshot(handle:string,title:string){
  const view=projectScreenshotViews[handle];
  return view?{url:`/project-screenshots/${handle}.jpg`,altText:`${title} — actual application screenshot: ${view}`}:undefined;
}
