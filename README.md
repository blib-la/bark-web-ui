# 🐶 Bark WEB UI

A Next.js Frontend for [Bark](https://github.com/suno-ai/bark). Please refer to the original docs for up to date
information on Bark by [Suno](https://www.suno.ai/).

## Notice

Bark is limited to ~13 seconds af output. This demo does not (yet) handle longer texts, but we already have protottypes that handle it, so this will be rather easy to add. **stay tuned**

This project (currently) assumes that you have used npm before and are comfortable ensuring your environment to be set
up.

## User Interface

![image](https://github.com/failfa-st/bark-web-ui/assets/1148334/0843b43c-233a-402b-a519-705fb30af981)


## Setup

Certain steps (to get the miniconda running with GPU supprt) were boldly copied from [this Gradio Web-ui for Bark](https://github.com/Fictiverse/bark).
TBH, I have no Idea what I did here but it might just work :). If you know your way around python and setting this up manually, feel free to contribute.
I am no Python developer and was only able to adjust things based on trial and error, (adjusting types in the python code)

### Windows

You can try the [one click installer](https://github.com/failfa-st/bark-web-ui/releases/download/v0.1.0/bark-ui-windows.zip).
Simply download it, extract it and double-click `run.bat` (and hope that it works).
If you want to update the project, you can run the `update.bat` file.
If it doesn't work feel free to open an issue, so that we can look into fixing any issues that might occur.

Thank you

### MacOS & Linux

1. Clone this repository
2. Ensure that you have `python` installed
3. Ensure that you have `node@18` installed (you can run `nvm use` if you use [NVM](https://github.com/nvm-sh/nvm))
4. run `npm install` to install npm dependencies
5. run `pip install .` to install python requirements
6. (once) run `npm run download:model` to download the model (also executes [bark with a test generation](#download))
7. run `npm run dev` (or `npm run build && npm start` if you don't plan to make changes to the source code)

### Download

The `download:model` script should download the model and run a test generation:

> 💡 Info  
> Example on macOS M1 PRO, using CPU (no optimizations)  
> Windows/Linux with an Nvidia will be a lot faster (highly recommended)  
> An [RTX4090](https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4090/) will generate the test in ~2 seconds

```
> download:model
> python -m bark --text "You are all set up."

No GPU being used. Careful, inference might be very slow!
100%|██████████████████████████████████████████████████████████| 100/100 [00:08<00:00, 11.72it/s]
100%|██████████████████████████████████████████████████████████████| 7/7 [00:27<00:00,  3.99s/it]
Done! Output audio file is saved at: './bark_generation.wav'

Process finished with exit code 0
```
