import classNames from 'classnames';
import {FC, useMemo} from 'react';
import {useSelector} from 'react-redux';
import {GameSelectors} from '../../../store/game/game-selectors';
import {GameBlockIndex} from '../../atoms/game/GameBlockIndex';
import {ClassNameProps} from '../../particles/particles.types';
import './GameGrid.css';

export const GameGrid: FC<ClassNameProps> = ({className}) => {
    const [width, height] = useSelector(GameSelectors.size);
    const blocks = useMemo(
        () => Array(width * height).fill(null),
        [width, height]
    );

    return (
        <div
            className={classNames(
                className,
                'game-grid ml-auto mr-auto w-full min-w-full min-h-full overflow-visible pb-4'
            )}
            style={{
                gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`,
                gridAutoRows: 'minmax(0, 1fr)',
                paddingBottom: '2.5rem'
            }}
        >
            {blocks.map((_, indx) => (
                <GameBlockIndex key={indx} indx={indx} />
            ))}
        </div>
    );
};
