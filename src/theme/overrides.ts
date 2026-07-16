import { alpha } from '@mui/material/styles';
import type { Components, Theme } from '@mui/material/styles';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import type { CustomShadows } from './custom-shadows';

export function getComponents(
  themeMode: 'light' | 'dark',
  palette: Theme['palette'],
  customShadows: CustomShadows
): Components<Omit<Theme, 'components'>> {
  const isLight = themeMode === 'light';

  return {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
        },
        html: {
          margin: 0,
          padding: 0,
          width: '100%',
          height: '100%',
          WebkitOverflowScrolling: 'touch',
        },
        body: {
          margin: 0,
          padding: 0,
          width: '100%',
          height: '100%',
          fontFamily: 'Poppins, sans-serif',
          backgroundColor: palette.background.default,
          color: palette.text.primary,
          transition: 'background-color 0.2s ease, color 0.2s ease',
        },
        '#root': {
          width: '100%',
          height: '100%',
        },
        /* Custom Scrollbar */
        '::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '::-webkit-scrollbar-track': {
          background: palette.background.default,
        },
        '::-webkit-scrollbar-thumb': {
          background: isLight ? '#DFE3E8' : '#454F5B',
          borderRadius: '4px',
        },
        '::-webkit-scrollbar-thumb:hover': {
          background: isLight ? '#C4CDD5' : '#637381',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: customShadows.card,
          borderRadius: 16,
          position: 'relative',
          zIndex: 0, // Fixes Safari overflow: hidden with border-radius
          transition: 'box-shadow 0.3s ease, transform 0.3s ease',
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: '24px 24px 0px 24px',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '24px',
          '&:last-child': {
            paddingBottom: '24px',
          },
        },
      },
    },
    MuiButton: {
      variants: [
        {
          props: { variant: 'signInV2' },
          style: {
            height: '40px',
            padding: '8px 20px',
            fontSize: '14px',
            fontWeight: 600,
            borderRadius: '24px',
            color: palette.primary.contrastText,
            backgroundColor: palette.primary.main,
            '&:hover': {
              backgroundColor: palette.primary.light,
              boxShadow: 'none',
            },
            '&.Mui-disabled': {
              backgroundColor: alpha(palette.primary.main, 0.5),
              color: alpha('#ffffff', 0.7),
            }
          },
        },
        {
          props: { variant: 'toolbar' },
          style: {
            borderRadius: '12px',
            height: '40px',
            padding: '0 16px',
            fontWeight: 600,
            fontSize: '14px',
            color: palette.text.secondary,
            backgroundColor: 'transparent',
            '&:hover': {
              color: palette.primary.main,
              backgroundColor: palette.grey[300]
            },
          },
        },
        {
          props: { variant: 'signIn' },
          style: {
            height: '40px',
            padding: '8px 20px',
            fontSize: '16px',
            fontWeight: 600,
            borderRadius: '24px',
            color: palette.primary.contrastText,
            backgroundColor: palette.primary.main,
            '&:hover': {
              backgroundColor: palette.primary.light,
              boxShadow: 'none',
            },
          },
        },
        {
          props: { variant: 'modalAdd' },
          style: {
            height: 40,
            borderRadius: '24px',
            padding: '8px 20px',
            fontWeight: 600,
            fontSize: '16px',
            color: palette.primary.contrastText,
            backgroundColor: palette.primary.main,
            '&.Mui-disabled': {
              color: isLight ? palette.grey[500] : palette.grey[600],
              backgroundColor: alpha(palette.primary.main, 0.48),
            },
            '&:hover': {
              backgroundColor: palette.primary.light,
            },
          },
        },
        {
          props: { variant: 'modalCancel' },
          style: {
            height: 40,
            borderRadius: '24px',
            padding: '8px 20px',
            fontWeight: 600,
            fontSize: '16px',
            color: palette.text.secondary,
            border: `1px solid ${palette.divider}`,
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: palette.common.white,
              borderColor: palette.text.secondary,
            },
          },
        },
      ],
      styleOverrides: {
        root: {
          fontWeight: 600,
          textTransform: 'none',
          padding: '8px 18px',
          borderRadius: 8,
          transition: 'all 0.2s ease-in-out',
          '&.MuiButton-containedPrimary': {
            boxShadow: customShadows.primary,
            '&:hover': {
              boxShadow: 'none',
            },
          },
          '&.MuiButton-containedSecondary': {
            boxShadow: customShadows.secondary,
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    // Centralized Input & Form Controls overrides
    MuiInputLabel: {
      defaultProps: {
        shrink: true,
      },
      styleOverrides: {
        root: {
          fontSize: '12px',
          fontWeight: 600,
          color: isLight ? palette.grey[800] : '#919EAB',
          // backgroundColor: isLight ? '#FFFFFF' : palette.background.paper,
          paddingLeft: '4px',
          paddingRight: '4px',
          transform: 'translate(10px, -8px) scale(1)', // shifted up by default
          '&.MuiInputLabel-sizeSmall': {
            transform: 'translate(14px, -8px) scale(0.85)',
            fontSize: '12px',
          },
          '&.Mui-focused': {
            color: palette.primary.main,
          },
          '&.MuiInputLabel-shrink': {
            transform: 'translate(10px, -8px) scale(1)',
            '&.MuiInputLabel-sizeSmall': {
              transform: 'translate(14px, -8px) scale(0.85)',
            },
          },
          '&.MuiFormLabel-filled': {
            transform: 'translate(10px, -8px) scale(1)',
            '&.MuiInputLabel-sizeSmall': {
              transform: 'translate(14px, -8px) scale(0.85)',
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          height: 40,
          fontSize: '14px',
          backgroundColor: isLight ? '#FFFFFF' : palette.background.paper,
          '& .MuiInputAdornment-root': {
            marginRight: 0
          },
          '&.MuiInputBase-sizeSmall': {
            height: 30,
          },
          '&.large': {
            height: 48,
          },
          '&.MuiInputBase-sizeSmall legend': {
            fontSize: '0.80em',
          },
          '& fieldset': {
            borderColor: palette.grey[500],
          },
          '&:hover fieldset': {
            borderColor: alpha(palette.grey[500], 0.35),
          },
          '&.Mui-focused fieldset': {
            borderColor: palette.primary.main,
            borderWidth: '1.5px',
          },
          '&.Mui-disabled fieldset': {
            borderColor: palette.action.disabledBackground,
          },
        },
        input: {
          height: 40,
          padding: '0 12px',
          fontWeight: 400,
          color: isLight ? palette.grey[700] : palette.text.primary,
          '&.MuiInputBase-inputSizeSmall': {
            padding: '6px',
          },
        },
        notchedOutline: {
          borderColor: palette.grey[500],
          '& legend': {
            color: palette.grey[800],
            fontSize: '0.90em',
            maxWidth: '100%',
          },
        },
      },
    },
    MuiInputBase: {
      variants: [
        {
          props: { variant: 'cellEdit' },
          style: {
            fontSize: '13px',
            fontFamily: 'Poppins, sans-serif',
            color: palette.text.primary,
            width: '100%',
            '& .MuiInputBase-input': {
              padding: '4px 0',
              borderBottom: '2px solid transparent',
              transition: 'border-bottom-color 0.2s',
              '&:focus': {
                borderBottom: `2px solid ${palette.primary.main}`,
              }
            }
          }
        }
      ]
    },
    MuiNativeSelect: {
      styleOverrides: {
        select: {
          height: 48,
          fontSize: '12px',
          paddingLeft: '14px',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: isLight ? '#FFFFFF' : palette.background.paper,
          borderRadius: '8px',
          '&:focus': {
            borderRadius: '8px',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          height: '48px !important',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '14px',
        },
      },
    },
    // Centralized Table overrides
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          overflow: 'hidden',
          border: `1px solid ${palette.divider}`,
          boxShadow: '0px 0px 16px 0px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${palette.divider}`,
          fontFamily: 'Poppins, sans-serif',
          paddingLeft: '16px',
          paddingRight: '16px',
          paddingTop: '12px',
          paddingBottom: '12px',
        },
        head: {
          color: '#FFFFFF',
          fontWeight: 600,
          fontSize: '12px',
          lineHeight: 1.4,
          paddingTop: '16px',
          paddingBottom: '16px',
          backgroundColor: palette.primary.main,
        },
        body: {
          paddingTop: '12px',
          paddingBottom: '12px',
          fontSize: '13px',
          color: palette.text.primary,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&.MuiTableRow-hover:hover': {
            backgroundColor: alpha(palette.primary.main, 0.04),
          },
        },
      },
    },
    MuiMobileDatePicker: {
      defaultProps: {
        slotProps: {
          textField: {
            size: 'small',
            slotProps: {
              inputLabel: {
                shrink: true,
                sx: {
                  fontSize: '12px',
                  fontWeight: 600,
                  transform: 'translate(14px, -6px) scale(0.8)',
                  color: isLight ? palette.grey[700] : '#919EAB',
                  '&.Mui-focused': { color: palette.primary.main }
                }
              }
            },
            sx: {
              width: '140px',
              height: 40,
              '&.inline .MuiInputBase-input, &.inline .MuiPickersSectionList-sectionContent': {
                fontSize: '15px',
              },
              '&.inline .MuiPickersOutlinedInput-notchedOutline': {
                borderColor: 'transparent',
              },
              '&.small': {
                height: 30
              },
              '&.large-input': {
                width: '100%',
                bgcolor: palette.common.white
              },
              '& .MuiInputBase-root': {
                height: 40,
                bgcolor: isLight ? '#FFFFFF' : palette.background.paper,
                borderRadius: 1,
                paddingRight: '4px',
              },
              '& .MuiPickersInputBase-root': {
                height: 40,
              },
              '& .MuiInputBase-input': {
                fontSize: '12px',
              },
              '& .MuiPickersSectionList-sectionContent': {
                fontSize: '12px',
              },
              '& .MuiPickersSectionList-root': {
                padding: '4px 0',
              },
              '& .MuiPickersOutlinedInput-notchedOutline': {
                borderColor: palette.grey[500],
              },
              '& .MuiOutlinedInput-notchedOutline legend': {
                fontSize: '0.95em',
              },
              '& .MuiFormLabel-root': {
                color: palette.grey[800],
              },
              '& .MuiInputAdornment-root': {
                marginLeft: 0,
              },
              '& .MuiInputAdornment-root .MuiButtonBase-root svg': {
                width: '18px',
                height: '18px',
                marginRight: '5px'
              },
              '& .MuiIconButton-root': {
                padding: 0,
              }
            }
          },
          actionBar: {
            actions: ['clear', 'today', 'accept'],
          }
        }
      }
    }
  };
}
