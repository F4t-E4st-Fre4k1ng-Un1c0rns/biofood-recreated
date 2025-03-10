from collections.abc import AsyncGenerator
from typing import Callable, TypeVar

InputDTO = TypeVar("InputDTO")
OutputDTO = TypeVar("OutputDTO")


class Interactor[InputDTO, OutputDTO]:
    async def __call__(self, data: InputDTO) -> OutputDTO:
        raise NotImplementedError


class InteractorGenerator[InputDTO, OutputDTO]:
    async def __call__(self, data: InputDTO) -> AsyncGenerator[OutputDTO]:
        raise NotImplementedError


InteractorT = TypeVar("InteractorT")
InteractorFactory = Callable[[], InteractorT]
