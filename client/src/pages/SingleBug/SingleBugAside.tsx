import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { StoreState } from 'store';
import { editLabels } from 'store/ducks/single-bug';

import Label from 'components/common/Label';
import Flex from 'components/common/Flex';
import Button from 'components/common/Button';
import Toast from 'components/common/Toast';
import Avatar from 'components/Avatar/Avatar';
import LabelEditDropdown from 'components/LabelEditDropdown/LabelEditDropdown';

// get unique avatar images from all comments
const getParticipants = (bug: any): string[] => {
  if (bug && bug.comments) {
    return bug.comments
      .map((c: any) => c.author.username)
      .filter(
        (item: string, pos: number, array: string[]) =>
          array.indexOf(item) === pos
      );
  }
  return [];
};

interface SingleBugAsideProps {
  bugId: number | string;
  bug: any;
}
const SingleBugAside: React.FC<SingleBugAsideProps> = ({ bugId, bug }) => {
  const dispatch = useDispatch<any>();
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [
    labelEditPending,
    labelEditError
  ] = useSelector((state: StoreState) => [
    state.loading['singlebug/EDIT_LABELS'],
    state.error['singlebug/EDIT_LABELS']
  ]);

  const handleSaveLabel = (toggleDropdown: Function) => {
    dispatch(editLabels(bugId, selectedLabels)).then(() => {
      toggleDropdown(false);
    });
  };

  let participants: string[] = getParticipants(bug);

  return (
    <>
      <div>
        <Toast isVisible={!!labelEditError} message={labelEditError} />

        <h4 className="label__header color--gray">
          Labels
          <LabelEditDropdown
            updateSelectedLabels={labels => setSelectedLabels(labels)}
            defaultChecked={bug.labels}
            className="label__dropdown"
            trigger={toggle => (
              <FontAwesomeIcon
                className="open_modal_btn"
                onClick={toggle}
                size="sm"
                icon="cog"
              />
            )}
          >
            {(toggleDropdown: Function) => (
              <Button
                icon="tag"
                size="sm"
                isLoading={labelEditPending}
                onClick={() => {
                  handleSaveLabel(toggleDropdown);
                }}
              >
                Update labels
              </Button>
            )}
          </LabelEditDropdown>
        </h4>

        <Flex>
          {bug.labels &&
            bug.labels.map((label: string, i: number) => (
              <Label className="mt-5" type={label} key={i}>
                {label}
              </Label>
            ))}
        </Flex>
      </div>
      <div>
        <h4 className="color--gray">{participants.length} participants</h4>
        <Flex>
          {participants.map((participant: string, i: number) => (
            <Avatar
              key={i}
              width="40px"
              height="40px"
              style={{ marginRight: 10 }}
              size={45}
              username={participant}
            />
          ))}
        </Flex>
      </div>
    </>
  );
};

export default SingleBugAside;