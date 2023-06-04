import PauseRounded from "@mui/icons-material/PauseRounded";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import VolumeDownRounded from "@mui/icons-material/VolumeDownRounded";
import VolumeUpRounded from "@mui/icons-material/VolumeUpRounded";
import { Card } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import type { Generation } from "@/types/common";

function useAudio({ src }: { src: string }) {
	const ref = useRef<HTMLAudioElement | null>(null);
	const [state, setState] = useState({
		paused: false,
		playing: false,
		volume: 1,
		duration: 0,
		time: 0,
	});
	const controls = {
		seek: useCallback((time: number) => {
			if (ref.current) {
				setState(previousState => ({
					...previousState,
					time,
				}));
				ref.current.currentTime = time;
			}
		}, []),
		setVolume: useCallback((volume: number) => {
			if (ref.current) {
				ref.current.volume = volume;
				setState(previousState => ({
					...previousState,
					volume,
				}));
			}
		}, []),
		play: useCallback(() => {
			if (ref.current) {
				ref.current.play();
			}
		}, []),
		pause: useCallback(() => {
			if (ref.current) {
				ref.current.pause();
			}
		}, []),
	};

	useEffect(() => {
		const audio = new window.Audio(src);
		ref.current = audio;
		function handlePlay() {
			setState(previousState => ({
				...previousState,
				playing: true,
				paused: false,
			}));
		}

		function handlePause() {
			setState(previousState => ({
				...previousState,
				playing: false,
				paused: true,
			}));
		}

		function handleTimeUpdate() {
			setState(previousState => ({
				...previousState,
				time: audio.currentTime,
			}));
		}

		function handleDurationChange() {
			setState(previousState => ({
				...previousState,
				duration: audio.duration,
			}));
		}

		function handleEnded() {
			audio.currentTime = 0;
			setState(previousState => ({
				...previousState,
				playing: false,
				paused: false,
				time: 0,
			}));
		}

		audio.addEventListener("ended", handleEnded);
		audio.addEventListener("durationchange", handleDurationChange);
		audio.addEventListener("timeupdate", handleTimeUpdate);
		audio.addEventListener("play", handlePlay);
		audio.addEventListener("pause", handlePause);
		return () => {
			audio.removeEventListener("ended", handleEnded);
			audio.removeEventListener("durationchange", handleDurationChange);
			audio.removeEventListener("timeupdate", handleTimeUpdate);
			audio.removeEventListener("play", handlePlay);
			audio.removeEventListener("pause", handlePause);
		};
	}, [src]);

	return [state, controls, ref] as const;
}

const Widget = styled(Card)({
	padding: 16,
	borderRadius: 16,
	position: "relative",
	zIndex: 0,
});

const CoverImage = styled("div")({
	width: 100,
	height: 100,
	objectFit: "cover",
	overflow: "hidden",
	flexShrink: 0,
	borderRadius: 8,
});

const TinyText = styled(Typography)({
	fontSize: "0.75rem",
	opacity: 0.75,
	fontWeight: 500,
	letterSpacing: 0.2,
});

function formatDuration(time: number) {
	const value = Math.round(time);
	const minute = Math.floor(value / 60);
	const secondLeft = value - minute * 60;
	return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
}

export default function MusicPlayer({ download, text, voice, img }: Generation) {
	const [src, setSrc] = useState(img);

	const [state, { play, pause, seek, setVolume }] = useAudio({
		src: download,
	});

	return (
		<Widget>
			<Box sx={{ display: "flex", alignItems: "center" }}>
				<CoverImage>
					<Image
						src={src}
						alt={voice}
						width={150}
						height={150}
						onError={() => {
							setSrc("/voices/default.png");
						}}
						style={{
							height: "100%",
							width: "100%",
							objectPosition: "center",
							objectFit: "cover",
						}}
					/>
				</CoverImage>
				<Box sx={{ ml: 1.5, minWidth: 0 }}>
					<Typography variant="caption" fontWeight={500}>
						{voice}
					</Typography>
					<Typography noWrap>
						<b>{text}</b>
					</Typography>
				</Box>
			</Box>
			<Slider
				aria-label="time-indicator"
				size="small"
				value={state.time}
				min={0}
				max={state.duration}
				step={0.01}
				onChange={(event, value) => {
					seek(value as number);
				}}
				sx={{
					height: 4,
					"& .MuiSlider-thumb": {
						width: 8,
						height: 8,
						transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
						"&:before": {
							boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
						},
						"&.Mui-active": {
							width: 20,
							height: 20,
						},
					},
					"& .MuiSlider-rail": {
						opacity: 0.28,
					},
				}}
			/>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					mt: -2,
				}}
			>
				<TinyText>{formatDuration(state.time)}</TinyText>
				<TinyText>-{formatDuration(state.duration - state.time)}</TinyText>
			</Box>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					mt: -1,
				}}
			>
				<IconButton
					aria-label={state.playing ? "pause" : "play"}
					sx={{ color: "inherit" }}
					onClick={() => {
						if (state.playing) {
							pause();
						} else {
							play();
						}
					}}
				>
					{state.playing ? (
						<PauseRounded sx={{ fontSize: "3rem" }} htmlColor="inherit" />
					) : (
						<PlayArrowRounded sx={{ fontSize: "3rem" }} htmlColor="inherit" />
					)}
				</IconButton>
			</Box>
			<Stack spacing={2} direction="row" sx={{ mb: 1, px: 1 }} alignItems="center">
				<VolumeDownRounded htmlColor="inherit" />
				<Slider
					aria-label="Volume"
					value={state.volume}
					min={0}
					max={1}
					step={0.01}
					onChange={(event, value) => {
						setVolume(value as number);
					}}
					sx={{
						"& .MuiSlider-track": {
							border: "none",
						},
						"& .MuiSlider-thumb": {
							width: 24,
							height: 24,
							"&:before": {
								boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
							},
							"&:hover, &.Mui-focusVisible, &.Mui-active": {
								boxShadow: "none",
							},
						},
					}}
				/>
				<VolumeUpRounded htmlColor="inherit" />
			</Stack>
		</Widget>
	);
}
