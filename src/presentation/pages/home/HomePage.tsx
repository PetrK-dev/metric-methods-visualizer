// src/pages/HomePage.tsx
import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, CardActions, 
         Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../../../common/Header';
import { pageLayout, mainContainer, heroSection, sectionPaper, cardsGrid, card, cardContent, lastSectionPaper } from '../../../assets/styles/pages/pageStyles';


/**
 * Home page component of the application.
 * 
 * The home page serves as the main entry point to the application and provides navigation 
 * to different sections - theoretical pages and implementations of metric methods.
 * It contains introductory information about the application and navigation cards
 * for accessing other pages.
 * 
 * The page is structured with:
 * - A hero section with the application title and tagline
 * - A brief introduction to metric indexing methods
 * - Navigation cards for Theory, AESA, LAESA, M-Tree, and About sections
 * - A summary explaining the importance of studying metric methods
 * 
 * @returns {JSX.Element} Home page with navigation options to all application sections
 */
const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={pageLayout}>
      <Header pageTitle="Metrické indexační metody" />
      
      <Container maxWidth="lg" sx={mainContainer}>
        {/* Hero section */}
        <Box sx={heroSection}>
          <Typography variant="h3" component="h1" gutterBottom>
            Vizualizace metrických metod
          </Typography>
          <Typography variant="h5" color="textSecondary" paragraph>
            Prozkoumejte principy metrických indexačních metod prostřednictvím vytvořených vizualizací
          </Typography>
        </Box>
        
        {/* Brief introduction */}
        <Paper sx={sectionPaper}>
          <Typography variant="body1" paragraph>
            Tato aplikace demonstruje, jak fungují metrické indexační metody pro efektivní vyhledávání v metrických prostorech. 
            Vizuálně zobrazuje jednotlivé kroky algoritmů AESA, LAESA a M-Tree při různých typech dotazů.
          </Typography>
        </Paper>
        
        {/* Navigation cards */}
        <Grid container spacing={4} sx={cardsGrid}>
          {/* Theory card */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={card}>
              <CardContent sx={cardContent}>
                <Typography variant="h5" component="h2" gutterBottom>
                  Teorie
                </Typography>
                <Typography>
                  Teoretické základy metrických metod, metrických prostorů a principy indexace.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => navigate('/theory')}>
                  Více o teorii
                </Button>
              </CardActions>
            </Card>
          </Grid>
          
          {/* AESA card */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={card}>
              <CardContent sx={cardContent}>
                <Typography variant="h5" component="h2" gutterBottom>
                  AESA
                </Typography>
                <Typography>
                  Approximating Eliminating Search Algorithm - efektivní metoda využívající předpočítané vzdálenosti.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => navigate('/aesa')}>
                  Vyzkoušet AESA
                </Button>
              </CardActions>
            </Card>
          </Grid>
          
          {/* LAESA card */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={card}>
              <CardContent sx={cardContent}>
                <Typography variant="h5" component="h2" gutterBottom>
                  LAESA
                </Typography>
                <Typography>
                  Linear AESA - optimalizace AESA používající pivotní body pro redukci paměťové složitosti.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => navigate('/laesa')}>
                  Vyzkoušet LAESA
                </Button>
              </CardActions>
            </Card>
          </Grid>
          
          {/* M-Tree card */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={card}>
              <CardContent sx={cardContent}>
                <Typography variant="h5" component="h2" gutterBottom>
                  M-Tree
                </Typography>
                <Typography>
                  Hierarchická stromová struktura optimalizovaná pro metrické prostory a dynamické úpravy.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => navigate('/mtree')}>
                  Vyzkoušet M-Tree
                </Button>
              </CardActions>
            </Card>
          </Grid>
          
          {/* About card */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={card}>
              <CardContent sx={cardContent}>
                <Typography variant="h5" component="h2" gutterBottom>
                  O aplikaci
                </Typography>
                <Typography>
                  Návod k použití aplikace, popis vizualizací a informace o projektu.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => navigate('/about')}>
                  Více informací
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
        
        {/* Summary section - last section without bottom margin */}
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

export default HomePage;