from src.main import main
import pytest


def test_main(a_fixture):
    main()
    assert True
