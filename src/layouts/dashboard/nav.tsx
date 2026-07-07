import { alpha, useTheme } from '@mui/material/styles';
import {
  Box,
  Drawer,
  Typography,
  ListItemButton,
  IconButton,
} from '@mui/material';
import PCTooltip from '../../components/pc-tooltip';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Logo from '../../components/logo';
import { navConfig } from './config-navigation';
import { GREY } from '../../theme/palette';

// ----------------------------------------------------------------------

const NAV_WIDTH = 360;

// ----------------------------------------------------------------------

/**
 * Propiedades de la barra de navegación lateral.
 */
interface NavProps {
  openNav: boolean;
  onCloseNav: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}


/**
 * Barra de navegación lateral (Sidebar).
 * Renderiza los enlaces del menú basados en la configuración (navConfig) y maneja 
 * sus dos modos visuales: expandido (por defecto) o colapsado (íconos compactos).
 * 
 * En mobile, se comporta como un Drawer superpuesto temporal, mientras que en desktop es un contenedor permanente.
 */
export default function Nav({ 
  openNav, 
  onCloseNav, 
  activeTab, 
  setActiveTab,
  isCollapsed = false,
  onToggleCollapse
}: NavProps) {
  const theme = useTheme();

  const renderContent = (
    <Box
      sx={{
        height: 1,
        display: 'flex',
        flexDirection: 'column',
        pt: 4,
        px: isCollapsed ? 0.75 : 4,
        transition: theme.transitions.create(['padding'], {
          duration: theme.transitions.duration.shorter,
        }),
      }}
    >
      <Box sx={{ px: isCollapsed ? 2 : 0, pb: 1.5, display: 'inline-flex', alignItems: 'center', mb: 2 }}>
        <Logo compact={isCollapsed} />
      </Box>

      {/* Thin line separating logo from nav */}
      <Box 
        sx={{ 
          height: !isCollapsed ? '1px' : 0, 
          bgcolor: theme.palette.primary.main,
          mx: 0,
          mb: !isCollapsed ? 0.5 : 0,
        }} 
      />

      <Box 
        component="nav" 
        sx={{ 
          px: 0, 
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          pb: 2,
        }}
      >
        {navConfig.map((group, index) => (
          <Box key={group.subheader} sx={{ mb: isCollapsed ? 0 : 2.5 }}>
            {/* Group divider top for all groups except the first */}
            {index > 0 && (
              <Box 
                sx={{ 
                  height: !isCollapsed ? '1px' : 0, 
                  bgcolor: theme.palette.primary.main,
                  mx: 0,
                  mb: !isCollapsed ? 0.5 : 0,
                }} 
              />
            )}
            
            {!isCollapsed ? (
              <Typography
                variant="caption"
                sx={{
                  px: 0,
                  py: 0.5,
                  display: 'block',
                  color: theme.palette.mode === 'light' ? 'primary.main' : alpha(theme.palette.primary.light, 0.8),
                  fontWeight: 600,
                  fontSize: '14px',
                  letterSpacing: 1.2,
                  textTransform: 'uppercase'
                }}
              >
                {group.subheader}
              </Typography>
            ) : (
              // Thin grouping line when collapsed
              <Box 
                sx={{ 
                  my: !isCollapsed ? 0.75 : 0, 
                  height: !isCollapsed ? '1px' : 0, 
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  mx: 0.5 
                }} 
              />
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: !isCollapsed ? 'flex-start' : 'center', gap: isCollapsed ? 0.35 : 0.75, mt: 1 }}>
              {group.items.map((item) => {
                const active = activeTab === item.path || (item.path === '#client-management' && activeTab === '#client-profile');

                return (
                  <ListItemButton
                    key={item.title}
                    onClick={() => {
                      setActiveTab(item.path);
                      onCloseNav();
                    }}
                    sx={{
                      width: isCollapsed ? 60 : '100%',
                      maxWidth: isCollapsed ? 60 : 'auto',
                      minHeight: isCollapsed ? 60 : 40,
                      borderRadius: isCollapsed ? '100%' : 3,
                      px: isCollapsed ? 0 : 2,
                      py: isCollapsed ? 0 : 1.5,
                      mb: isCollapsed ? 0 : 0.5,
                      display: 'flex',
                      flexDirection: isCollapsed ? 'column' : 'row',
                      alignItems: 'center',
                      justifyContent: isCollapsed ? 'center' : 'flex-start',
                      color: 'text.secondary',
                      transition: 'all 0.2s',
                      ...(active && {
                        color: theme.palette.primary.main,
                        bgcolor: alpha(GREY[300], 1),
                        '&:hover': {
                          color: theme.palette.primary.light,
                          bgcolor: alpha(GREY[300], 1),
                        },
                      }),
                      '&:hover': {
                          color: theme.palette.primary.main,
                          bgcolor: alpha(GREY[300], 0),
                        }
                    }}
                  >
                    <PCTooltip describeChild title={item.title} placement="right" arrow disableHoverListener={!isCollapsed}>
                      <Box 
                        component="span" 
                        sx={{ 
                          width: 28, 
                          height: 28, 
                          mr: isCollapsed ? 0 : 1.5, 
                          mb: 0, 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          color: active 
                            ? theme.palette.primary.main 
                            : 'text.secondary',
                          '& svg [fill="#737373"]': {
                            fill: active 
                              ? theme.palette.primary.main 
                              : '#737373',
                            transition: 'fill 0.2s ease',
                          },
                          '& svg [stroke="#737373"]': {
                            stroke: active 
                              ? theme.palette.primary.main
                              : '#737373',
                            transition: 'stroke 0.2s ease',
                          },
                          '&:hover svg [stroke="#737373"]': {
                            stroke: isCollapsed ? theme.palette.primary.main : '#737373'
                          },
                          '&:hover svg [fill="#737373"]': {
                            fill: isCollapsed ? theme.palette.primary.main : '#737373'
                          }
                        }}
                      >
                        {item.icon}
                      </Box>
                    </PCTooltip>
                    <Box 
                      component="span" 
                      sx={{ 
                        fontSize: isCollapsed ? '0px' : '16px',
                        textAlign: isCollapsed ? 'center' : 'left',
                        lineHeight: 1.2,
                        fontWeight: active ? 600 : 600,
                        width: '100%',
                        ...(isCollapsed && {
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          px: 0.25,
                        }),
                        transition: theme.transitions.create(['opacity', 'font-size'], {
                          duration: theme.transitions.duration.shorter,
                        }),
                        opacity: !isCollapsed ? 1 : 0,
                        visibility: !isCollapsed ? 'visible' : 'hidden',
                      }}
                    >
                      {item.title}
                    </Box>
                  </ListItemButton>
                );
              })}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: isCollapsed ? 90 : NAV_WIDTH },
        transition: theme.transitions.create(['width'], {
          duration: theme.transitions.duration.shorter,
        }),
        position: 'relative', // Anchor the toggle button
      }}
    >
      {/* Mobile Drawer (Always standard layout) */}
      <Drawer
        open={openNav}
        onClose={onCloseNav}
        ModalProps={{
          keepMounted: true,
        }}
        slotProps={{
          paper: {
            sx: {
              width: NAV_WIDTH,
              bgcolor: 'background.paper',
              borderRight: `1px solid ${theme.palette.divider}`,
            }
          }
        }}
        sx={{
          display: { xs: 'block', lg: 'none' },
        }}
      >
        {renderContent}
      </Drawer>

      {/* Desktop Permanent Drawer */}
      <Drawer
        open
        variant="permanent"
        slotProps={{
          paper: {
            sx: {
              width: isCollapsed ? 90 : NAV_WIDTH,
              bgcolor: 'background.paper',
              borderRight: `1px solid ${theme.palette.divider}`,
              borderImage: 'none',
              transition: theme.transitions.create(['width'], {
                duration: theme.transitions.duration.shorter,
              }),
              overflowX: 'hidden',
            }
          }
        }}
        sx={{
          display: { xs: 'none', lg: 'block' },
        }}
      >
        {renderContent}
      </Drawer>

      {/* Collapse Toggle Button (Positioned outside Drawer paper to prevent clipping) */}
      <IconButton
        onClick={onToggleCollapse}
        sx={{
          display: { xs: 'none', lg: 'flex' },
          position: 'absolute',
          top: 32,
          right: -16, // Floats exactly half outside the sidebar border
          width: 32,
          height: 32,
          bgcolor: 'background.paper',
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)',
          zIndex: theme.zIndex.drawer, // Float above Drawer and Main content
          p: 0.2,
          color: theme.palette.mode === 'light' ? GREY[800] : GREY[300],
          transition: theme.transitions.create(['color', 'background-color'], {
            duration: theme.transitions.duration.shorter,
          }),
          '&:hover': {
            bgcolor: theme.palette.mode === 'light' ?  GREY[0] : GREY[900],
            color: 'primary.main',
          },
        }}
      >
        {isCollapsed ? (
          <ChevronRight size={18} />
        ) : (
          <ChevronLeft size={18} />
        )}
      </IconButton>
    </Box>
  );
}
export { NAV_WIDTH };
