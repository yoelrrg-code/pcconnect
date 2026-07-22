import { useState } from "react";
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { fadeInUp } from "../../../theme/effects";
import { BarChart } from "@mui/x-charts/BarChart";

// ----------------------------------------------------------------------

const series = [
  {
    label: "CODED AT REDUCED LEVEL - D1010",
    data: [0, 1, 1],
    color: "#FFB522",
    stack: "cpt",
    stackOrder: "reverse",
    barLabel: "value" as const,
    stackOffset: "expand",
  },
  {
    label: "DOWNCODED MDM - DATA - D655",
    data: [6, 11, 13],
    color: "#AE006E",
    stack: "cpt",
    stackOrder: "reverse",
    barLabel: "value" as const,
    stackOffset: "expand",
  },
  {
    label: "POTENTIAL  CRITICAL CARE , NOT DOCUMENTED - D765",
    data: [1, 38, 43],
    color: "#728AAB",
    stack: "cpt",
    stackOrder: "reverse",
    barLabel: "value" as const,
    stackOffset: "expand",
  },
  {
    label: "DOWNCODED CC TO 5, NO UNSTABLE DOC. - D865",
    data: [2, 87, 91],
    color: "#7E39B1",
    stack: "cpt",
    stackOrder: "reverse",
    barLabel: "value" as const,
    stackOffset: "expand",
  },
  {
    label: "LACK OF DOCUMENTATION, ECG INTERP. - D900",
    data: [23, 217, 290],
    color: "#00B79F",
    stack: "cpt",
    stackOrder: "reverse",
    barLabel: "value" as const,
    stackOffset: "expand",
  },
  {
    label: "LACK OF IMAGE ARCHIVAL, ULTRASOUND - D950",
    data: [10, 38, 44],
    color: "#EE7BC5",
    stack: "cpt",
    stackOrder: "reverse",
    barLabel: "value" as const,
    stackOffset: "expand",
  },
  {
    label: "POTENTIAL SHARED VISIT, NO MD SIG - D951",
    data: [0, 0, 72],
    color: "#242B38",
    stack: "cpt",
    stackOrder: "reverse",
    barLabel: "value" as const,
    stackOffset: "expand",
  },
  {
    label: "POTENTIAL SHARED VST, MD SIG,NO DOC - D952",
    data: [0, 0, 130],
    color: "#008270",
    stack: "cpt",
    stackOrder: "reverse",
    barLabel: "value" as const,
    stackOffset: "expand",
  },
  {
    label: "POTENTIAL SHARED VST, DEF MD DOC - D953",
    data: [0, 2, 182],
    color: "#E533A5",
    stack: "cpt",
    stackOrder: "reverse",
    barLabel: "value" as const,
    stackOffset: "expand",
  },
] as const;

const xlabels = [
  "Individual (Kaylin Flowers)",
  "Peer Group",
  "Facility (All)",
] as const;

export default function DeficiencyView({ resetKey }: { resetKey: string }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [adminFilter, setAdminFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("");
  const [secondaryFilter, setSecondaryFilter] = useState("");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        animation: `${fadeInUp} 0.3s ease-in-out`,
      }}
    >
      {/* Top Filter Cards */}
      <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
        {/* Admin Filter Card */}
        <Card
          sx={{
            pt: 3,
            pb: 4,
            px: 3,
            flex: { xs: "1 1 100%", md: "0 0 calc(35% - 12px)" },
            minWidth: 280,
            borderRadius: 3,
            boxShadow: "none",
          }}
        >
          <Typography sx={{ mb: 2, fontSize: "18px", fontWeight: 600 }}>
            Admin Filter
          </Typography>

          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
            <TextField
              select
              value={adminFilter}
              onChange={(e) => setAdminFilter(e.target.value)}
              slotProps={{
                select: { native: true },
              }}
              sx={{
                "& .MuiInputBase-root": {
                  height: 40,
                },
              }}
            >
              <option value=""></option>
              <option value="admin1">Admin 1</option>
              <option value="admin2">Admin 2</option>
              <option value="admin3">Admin 3</option>
            </TextField>

            <Button variant="modalAdd">Filter</Button>
          </Box>
        </Card>

        {/* Filter Card */}
        <Card
          sx={{
            pt: 3,
            pb: 4,
            px: 3,
            flex: { xs: "1 1 100%", md: "1 1 calc(65% - 12px)" },
            minWidth: 320,
            borderRadius: 3,
            boxShadow: "none",
          }}
        >
          <Typography sx={{ mb: 2, fontSize: "18px", fontWeight: 600 }}>
            Filter
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <TextField
              select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              slotProps={{
                select: { native: true },
              }}
              sx={{
                "& .MuiInputBase-root": {
                  height: 40,
                },
              }}
            >
              <option value=""></option>
              <option value="Last 3 Months">Last 3 Months</option>
              <option value="Last Month">Last Month</option>
              <option value="Last Year">Last Year</option>
            </TextField>

            <TextField
              select
              value={secondaryFilter}
              onChange={(e) => setSecondaryFilter(e.target.value)}
              slotProps={{
                select: { native: true },
              }}
              sx={{
                "& .MuiInputBase-root": {
                  height: 40,
                },
              }}
            >
              <option value=""></option>
              <option value="Option 1">Option 1</option>
              <option value="Option 2">Option 2</option>
              <option value="Option 3">Option 3</option>
            </TextField>

            <Button variant="modalAdd">Filter</Button>
          </Box>
        </Card>
      </Box>

      {/* Main Charts Area */}
      <Card
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          boxShadow: "none",
          width: "100%",
        }}
      >
        <Box sx={{ width: "100%", height: 'auto', minHeight: 700 }}>
          <BarChart
            key={resetKey}
            series={series}
            xAxis={[
              {
                scaleType: "band",
                data: [...xlabels],
                categoryGapRatio: 0.3,
                tickLabelInterval: () => true,
                tickLabelStyle: {
                  fontSize: 13,
                  fontWeight: 500,
                  fill: theme.palette.text.primary,
                },
              },
            ]}
            yAxis={[
              {
                width: 50,
                valueFormatter: new Intl.NumberFormat("en-US", {
                  notation: "compact",
                  style: "percent",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format,
              },
            ]}
            height={700}
            slotProps={{
              legend: {
                direction: isMobile ? "horizontal" : "vertical",
                position: isMobile
                  ? { vertical: "top", horizontal: "center" }
                  : { vertical: "top", horizontal: "start" },
              },
            }}
            margin={{ top: isMobile ? 40 : 30, right: isMobile ? 0 : 10, bottom: isMobile ? 20 : 30, left: isMobile ? 0 : 60 }}
            sx={{
              "& text.MuiBarChart-label": {
                fill: "#ffffff !important",
                fontSize: 14,
                fontWeight: 600,
              },
              "& .MuiChartsLegend-label": {
                fontSize: isMobile ? 11 : 13,
              },
              "& .MuiChartsAxis-tickLabel, & .MuiChartsAxis-tickLabel tspan": {
                fill: `${theme.palette.text.primary} !important`,
                fontSize: "13px !important",
                fontWeight: "500 !important",
                visibility: "visible !important",
                opacity: "1 !important",
              },
              "& .MuiChartsAxisHighlight-root": {
                fill: "rgba(0, 0, 25, 0.40) !important",
              },
            }}
          />
        </Box>
      </Card>
    </Box>
  );
}
