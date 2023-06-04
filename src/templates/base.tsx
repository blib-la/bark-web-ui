import FavoriteIcon from "@mui/icons-material/Favorite";
import MenuIcon from "@mui/icons-material/Menu";
import {
	AppBar,
	Box,
	Drawer,
	IconButton,
	List,
	ListItemButton,
	ListItemText,
	Stack,
	Toolbar,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { useState } from "react";
export interface TemplateProps {
	children?: ReactNode;
}
export default function Template({ children }: TemplateProps) {
	const [menuOpen, setMenuOpen] = useState(false);
	function toggleMenu() {
		setMenuOpen(previousValue => !previousValue);
	}

	return (
		<Stack sx={{ height: "100%", overflow: "hidden" }}>
			<AppBar>
				<Toolbar>
					<IconButton color="inherit" edge="start" onClick={toggleMenu}>
						<MenuIcon />
					</IconButton>
				</Toolbar>
			</AppBar>
			<Toolbar />
			<Drawer open={menuOpen} onClose={toggleMenu} sx={{ ".MuiPaper-root": { width: 250 } }}>
				<List>
					{Array.from({ length: 5 }, (_, index) => (
						<ListItemButton key={index}>
							<ListItemText primary={`Item ${index + 1}`} />
						</ListItemButton>
					))}
				</List>
			</Drawer>
			<Box
				sx={{
					display: "flex",
					flex: 1,
					pt: 2,
					overflow: "hidden",
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
