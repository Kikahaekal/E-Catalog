// Isolated component rendering with read-only API fixtures. No token or guard bypass is installed in the app.
async function renderPage(win, path, route) {
  const getModule = async path => (await win.fetch(path)).text();
  const main = await getModule('/src/main.tsx');
  const layout = await getModule('/src/layout/AdminLayout.tsx');
  const page = await getModule(path);
  const reactUrl = page.match(/from\s*["']([^"']*\/react\.js[^"']*)["']/)[1];
  const domUrl = main.match(/from\s*["']([^"']*\/react-dom_client\.js[^"']*)["']/)[1];
  const routerUrl = layout.match(/from\s*["']([^"']*\/react-router-dom\.js[^"']*)["']/)[1];
  const importAt = url => win.eval(`import(${JSON.stringify(url)})`);
  const [{default: React}, {default: ReactDOM}, {MemoryRouter}, {default: AdminPage}, {IonApp}] = await Promise.all([importAt(reactUrl),importAt(domUrl),importAt(routerUrl),importAt(path),importAt('/node_modules/.vite/deps/@ionic_react.js' + new URL(reactUrl,win.location.href).search)]);
  win.document.getElementById('root').remove();
  const container = win.document.createElement('div');
  container.id = 'session-review';
  container.style.cssText = 'position:fixed;inset:0;background:white;z-index:100';
  win.document.body.appendChild(container);
  win.__adminReviewRoot = ReactDOM.createRoot(container);
  win.__adminReviewRoot.render(React.createElement(IonApp, null, React.createElement(MemoryRouter,{initialEntries:[route]},React.createElement(AdminPage))));
}



const pages=[
 ['Iucn','/iucn','iucn',{id:1,code:'EN',name:'Endangered'}],
 ['WppZone','/wpp','wpp',{id:1,code:'711',description:'Perairan uji'}],
 ['Reference','/referensi','reference',{id:'9007199254740993',authors:'Penulis uji',title:'Judul uji'}],
 ['Regency','/daerah','regency',{id:1,name:'Bintan',province:'Kepulauan Riau'}],
 ['Species','/spesies','species',{id:'9007199254740993',commonName:'Ikan uji',scientificName:'Species test',iucnStatusId:1}],
];
function fixtures(){
 for(const method of ['POST','PUT','PATCH','DELETE'])cy.intercept({method,url:'**/api/**'},()=>{throw new Error('API writes forbidden in form visual tests');});
 for(const [, ,endpoint,item] of pages)cy.intercept('GET',`**/api/${endpoint}*`,{body:{message:'Fixture',data:[item]}});
}
function mount(name,route){
 cy.visit('/login');cy.get('.login-page').should('be.visible');
 cy.window().then(win=>renderPage(win,`/src/pages/Admin/master/${name}/${name}.tsx`,route));
}
function openCreate(endpoint, keyboardActivation=false){
 let presented;
 cy.get(`.${endpoint}-table`).should('exist');
 cy.get('ion-modal.admin-form-modal').first().then($m=>{presented=new Cypress.Promise(resolve=>$m[0].addEventListener('ionModalDidPresent',resolve,{once:true}));});
 cy.get(`.${endpoint}-add-button`).should('not.have.attr','disabled');
 if(keyboardActivation)cy.get(`.${endpoint}-add-button`).shadow().find('button').focus().then($button=>$button[0].click());
 else cy.get(`.${endpoint}-add-button`).click();
 cy.then(()=>presented);
 cy.get('ion-modal.admin-form-modal:visible').as('modal');
 cy.get('@modal').find('ion-input input').first().should('be.visible');
}
function bounds(){
 cy.get('@modal').then($m=>{
  const panel=$m[0].shadowRoot.querySelector('[part="content"]');
  const rect=panel.getBoundingClientRect();
  expect(rect.width).to.be.greaterThan(200);
  expect(rect.height).to.be.greaterThan(200);
 });
 cy.window().then(win=>{
  const modal=win.document.querySelector('ion-modal.admin-form-modal');
  const panel=modal.shadowRoot.querySelector('[part="content"]');
  const r=panel.getBoundingClientRect();
  expect(r.left).to.be.at.least(0);expect(r.right).to.be.at.most(win.innerWidth+1);
  expect(r.top).to.be.at.least(0);expect(r.bottom).to.be.at.most(win.innerHeight+1);
  const fields=modal.querySelector('.admin-form-modal__fields');
  expect(fields.scrollWidth).to.be.at.most(fields.clientWidth+1);
  expect(win.getComputedStyle(modal.querySelector('ion-toolbar')).getPropertyValue('--background').trim()).to.eq('#fff');
 });
 cy.get('@modal').contains('ion-button','Batal').should('be.visible');
 cy.get('@modal').find('ion-button[type=submit]').should('be.visible');
}
describe('Admin create/edit forms: real Ionic overlays with isolated API',()=>{
 beforeEach(fixtures);
 afterEach(()=>cy.then(()=>Cypress.automation('remote:debugger:protocol',{command:'Emulation.setEmulatedMedia',params:{features:[]}})));
 it('keeps short and long forms light with a dark system preference',()=>{
  cy.then(()=>Cypress.automation('remote:debugger:protocol',{command:'Emulation.setEmulatedMedia',params:{features:[{name:'prefers-color-scheme',value:'dark'}]}}));
  cy.viewport(375,810);
  for(const [name,route,endpoint] of pages){
   mount(name,route);openCreate(endpoint);bounds();
   cy.get('@modal').then($m=>expect($m[0].ownerDocument.defaultView.getComputedStyle($m[0]).colorScheme).to.eq('light'));
   cy.get('@modal').contains('ion-button','Batal').click();cy.get('ion-modal.admin-form-modal:visible').should('not.exist');
  }
 });
 it('keeps species selection in its existing Ionic alert with local styling',()=>{
  cy.viewport(1440,810);mount('Species','/spesies');openCreate('species');
  cy.get('@modal').find('ion-select').filter((_,el)=>el.placeholder==='Pilih IUCN').scrollIntoView().click();
  cy.get('ion-alert.admin-form-select-alert:visible').as('selectAlert');
  cy.get('@selectAlert').contains('Endangered').should('exist');
  cy.get('@selectAlert').then($a=>expect($a[0].ownerDocument.defaultView.getComputedStyle($a[0]).getPropertyValue('--background').trim()).to.eq('#fff'));
  cy.get('@selectAlert').find('button.alert-button').first().click();
  cy.get('ion-alert:visible').should('not.exist');
  cy.get('@modal').contains('ion-button','Batal').should('be.visible').click();
 });
 it('keeps modal focus contained and restores the opener after Escape',()=>{
  cy.viewport(375,810);mount('WppZone','/wpp');
  cy.get('.wpp-table').should('exist');
  cy.get('.wpp-add-button').shadow().find('button').focus();
  openCreate('wpp',true);
  cy.window().then(win=>{
   const modal=win.document.querySelector('ion-modal.admin-form-modal');
   win.document.querySelector('.wpp-add-button').shadowRoot.querySelector('button').focus();
   expect(modal.contains(win.document.activeElement)||win.document.activeElement===modal).to.eq(true);
  });
  cy.get('body').trigger('keydown',{key:'Escape'});
  cy.get('ion-modal.admin-form-modal:visible').should('not.exist');
  cy.get('.wpp-add-button').shadow().find('button').should('be.focused');
 });
 for(const [name,route,endpoint] of pages){
  for(const width of [320,360,375,768,1440])it(`${name} create at ${width}px`,()=>{
   cy.viewport(width,810);mount(name,route);openCreate(endpoint);bounds();
   cy.get('@modal').shadow().find('[role=dialog]').should('have.attr','aria-label');
   cy.get('@modal').find('ion-input').filter((_,el)=>el.required).first().find('input').should('have.attr','aria-label');
   if(endpoint==='species'){
    cy.get('@modal').find('.admin-form-modal__fields').then($f=>expect($f[0].scrollHeight).to.be.greaterThan($f[0].clientHeight));
   }else if(endpoint==='wpp'){
    cy.get('@modal').then($m=>expect($m[0].shadowRoot.querySelector('[part="content"]').getBoundingClientRect().height).to.be.lessThan(550));
   }
   if(width===375||width===1440)cy.screenshot(`${endpoint}-create-${width}`,{capture:'viewport'});
   cy.get('@modal').contains('ion-button','Batal').click();cy.get('ion-modal.admin-form-modal:visible').should('not.exist');
  });
  it(`${name} edit retains values and closes without API writes`,()=>{
   cy.viewport(1024,768);mount(name,route);
   let presented;
   cy.get(`.${endpoint}-table`).should('exist');
   cy.get('ion-modal.admin-form-modal').last().then($m=>{presented=new Cypress.Promise(resolve=>$m[0].addEventListener('ionModalDidPresent',resolve,{once:true}));});
   cy.get(`.${endpoint}-action-button`).eq(1).click();cy.then(()=>presented);cy.get('ion-modal.admin-form-modal:visible').as('modal');
   cy.get('@modal').find('ion-input input').eq(endpoint==='reference'?1:0).should('not.have.value','');bounds();
   cy.get('@modal').find('ion-header ion-button').click();cy.get('ion-modal.admin-form-modal:visible').should('not.exist');
  });
 }
});
