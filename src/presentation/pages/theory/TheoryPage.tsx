import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, CardActions, Button, Container, Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Header from '../../../common/Header';
import { pageLayout, mainContainer, card, cardContent, lastSectionPaper, breadcrumbsContainer } from '../../../assets/styles/pages/pageStyles';

/**
 * Component displaying the main theory page of metric methods.
 * 
 * This component serves as a hub for all theoretical sections of the application.
 * It provides an overview of the importance of studying metric methods and links
 * to more detailed theoretical pages (Basics, Metric Space, Key Principles).
 * 
 * The page acts as a central navigation point for all theory content, allowing users
 * to easily access the theoretical aspects they're interested in. It contains:
 * - Introduction to the theory of metric methods
 * - Navigation cards for each theoretical section with brief descriptions
 * - Summary explaining why metric methods are worth studying
 * 
 * This component helps users understand the overall structure of the theoretical
 * content and guides them to appropriate sections based on their interests.
 * 
 * @returns {JSX.Element} React component with overview of theoretical sections
 */
const TheoryPage: React.FC = () => {
  // Get navigation object for page transitions
  const navigate = useNavigate();

  return (
    <Box sx={pageLayout}>
      <Header pageTitle="Teorie metrických metod" />
      
      <Container maxWidth="lg" sx={mainContainer}>
        {/* Navigation */}  
        <Breadcrumbs sx={breadcrumbsContainer}>
            <Link component={RouterLink} to="/">
              Domů
            </Link>
            <Typography color="text.primary">Teorie</Typography>
        </Breadcrumbs>

        {/* Introduction section */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Teoretické základy metrických metod
          </Typography>
          <Typography variant="body1" paragraph>
            Tato sekce poskytuje teoretický základ pro pochopení principů metrických 
            indexačních metod a jejich využití v efektivním vyhledávání podobných objektů.
          </Typography>
        </Box>
        
        {/* Links to subpages */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={4}>
            <Card sx={card}>
              <CardContent sx={cardContent}>
                <Typography variant="h5" component="h2" gutterBottom>
                  Základy metrických metod
                </Typography>
                <Typography variant="body2">
                  Úvod do problematiky metrických metod, jejich význam a základní principy 
                  fungování při vyhledávání v rozsáhlých datových sadách.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => navigate('/theory/basics')}>
                  Přejít na základy
                </Button>
              </CardActions>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={card}>
              <CardContent sx={cardContent}>
                <Typography variant="h5" component="h2" gutterBottom>
                  Metrický prostor a metrika
                </Typography>
                <Typography variant="body2">
                  Definice metrického prostoru, axiomy metriky a konkrétní příklady 
                  vzdálenostních funkcí používaných v praxi.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => navigate('/theory/metric-space')}>
                  Přejít na metrický prostor
                </Button>
              </CardActions>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={card}>
              <CardContent sx={cardContent}>
                <Typography variant="h5" component="h2" gutterBottom>
                  Klíčové vlastnosti a principy
                </Typography>
                <Typography variant="body2">
                  Hlavní principy fungování metrických metod: modelování vztahů, 
                  využití trojúhelníkové nerovnosti, optimalizace výpočtů a omezení.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => navigate('/theory/key-principles')}>
                  Přejít na klíčové principy
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
        
        {/* Summary */}
        <Paper sx={lastSectionPaper}>
          <Typography variant="h6" gutterBottom>
            Proč studovat metrické metody?
          </Typography>
          <Typography variant="body1" paragraph>
            Metrické metody poskytují efektivní způsob, jak vyhledávat podobné objekty 
            v rozsáhlých datových sadách bez nutnosti porovnávat dotaz s každým objektem v databázi.
            Díky využití matematických vlastností metrických prostorů umožňují významně
            redukovat počet potřebných výpočtů a tím zrychlit proces vyhledávání.
          </Typography>
          <Typography variant="body1">
            Podrobnější vysvětlení najdete v jednotlivých teoretických sekcích.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default TheoryPage;