import { useState } from "react";
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  useTheme,
} from "@mui/material";
import { fadeInUp } from "../../../theme/effects";
import { BarChart } from "@mui/x-charts/BarChart";

// ----------------------------------------------------------------------

const series = [
  {
    label: "3 Months",
    data: [3.2228797468354444, 3.426316323940067, 3.261572073524633],
    color: "#00B79F",
    stack: "rvu-3",
    stackOrder: "reverse",
  },
  {
    label: "6 Months",
    data: [3.297459239130433, 3.4498340638697473, 3.2981354883078944],
    color: "#FFB63B",
    stack: "rvu-6",
    stackOrder: "reverse",
  },
  {
    label: "12 Months",
    data: [3.382454373819979, 3.47923747807403, 3.3326218252330686],
    color: "#E533A5",
    stack: "rvu-12",
    stackOrder: "reverse",
  },
] as const;

const xlabels = [
  "Individual (Kaylin Flowers)",
  "Peer Group",
  "Facility (All)",
] as const;

export default function RvuView({ resetKey }: { resetKey: string }) {
  const theme = useTheme();
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
        <Box sx={{ width: "100%", height: 700, minHeight: 700 }}>
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
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format,
              },
            ]}
            height={750}
            slotProps={{
              legend: {
                direction: "vertical",
                position: { vertical: "top", horizontal: "start" },
              },
            }}
            margin={{ top: 30, right: 10, bottom:60, left: 60 }}
            sx={{
              "& text.MuiBarChart-label": {
                fill: "#ffffff !important",
                fontSize: 14,
                fontWeight: 600,
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
