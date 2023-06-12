import FavoriteIcon from "@mui/icons-material/Favorite";
import { AppBar, Box, Stack, Toolbar } from "@mui/material";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
export interface TemplateProps {
	children?: ReactNode;
}
export default function Template({ children }: TemplateProps) {
	return (
		<Stack>
			<AppBar>
				<Toolbar>
					<Typography>Bark Web UI</Typography>
				</Toolbar>
			</AppBar>
			<Toolbar />
			<Box
				sx={{
					pt: 2,
				}}
			>
				{children}
			</Box>
			<Box sx={{ px: 4, py: 2 }}>
				<Typography>
					Built with <FavoriteIcon sx={{ fontSize: "1em", color: "error.main" }} /> by
					failfa.st
				</Typography>
			</Box>
		</Stack>
	);
}
