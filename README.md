# Neural-Guided Branch & Bound — Dynamic Delivery Route Optimization

> A GNN-augmented Branch-and-Bound solver for CVRP/TSP that learns branching heuristics from Strong Branching, reducing explored nodes by 60–80%.

## Quick Start

```bash
# Python environment
conda create -n ngbb python=3.11
conda activate ngbb
conda install -c conda-forge scip
pip install -r requirements.txt

# Verify SCIP
python -c "from pyscipopt import Model; m = Model(); print('SCIP OK')"

# Generate instances
python src/data/generate.py --split train --n-instances 50000 --size-min 20 --size-max 50

# Train (IL)
python src/training/train_il.py --config experiments/il_baseline.yaml

# Evaluate
python src/evaluation/benchmark.py --checkpoint checkpoints/best.pt --test-splits test_small test_large

# Visualizer
cd visualizer && npm install && npm run dev
```

## Architecture

See `NGBB_PROJECT.md` for the full execution document.
