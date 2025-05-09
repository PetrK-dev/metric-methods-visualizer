export const pageLayout = {
    display: "flex", 
    flexDirection: "column", 
    minHeight: "100vh"
  };
  
  export const mainContainer = {
    mt: 4, 
    mb: 4, 
    flex: 1
  };
  
  export const breadcrumbsContainer = {
    mb: 3
  };

export const cardsGrid = {
    mb: 6,
  };
  
  export const card = {
    height: '100%', 
    display: 'flex', 
    flexDirection: 'column'
  };
  
  export const cardContent = {
    flexGrow: 1
  };

  export const sectionPaper = {
    p: 3,
    mb: 4
  };
  
  export const lastSectionPaper = {
    p: 3
  };
  
  export const centeredSection = {
    mb: 4, 
    textAlign: 'center'
  };
  
  export const heroSection = {
    mb: 6, 
    textAlign: 'center'
  };

  export const theorySidebar = {
    pl: 2, 
    borderLeft: '4px solid #2196f3', 
    my: 2
  };
  
  export const theoryHeading = {
    mt: 2
  };
  
  export const theoryNote = {
    ml: 2, 
    fontStyle: 'italic'
  };
  
  export const theoryList = {
    mt: 1
  };

  export const createPlaceholder = (maxHeight = 200, marginTop = 2, marginBottom = 2) => ({
    maxHeight: `${maxHeight}px`, 
    bgcolor: '#f5f5f5', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    mt: marginTop, 
    mb: marginBottom
  });
  
  export const standardPlaceholder = createPlaceholder();
  export const largePlaceholder = createPlaceholder(250);
  export const diagramPlaceholder = createPlaceholder(400, 2, 2);